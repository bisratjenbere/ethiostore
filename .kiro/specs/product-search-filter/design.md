# Product Search & Filtering - Technical Design

## 🏗️ Architecture Overview

### High-Level Flow
```
User Input → URL Parameters → Server Action → Database Query → Results → UI Update
     ↓
  Debounce
     ↓
URL Sync ← Component State
```

---

## 🗂️ Data Flow

### 1. User Interaction
```typescript
// User types in search or selects filter
→ Component updates local state
→ useRouter updates URL parameters
→ Server Component re-renders with new params
→ Server Action fetches filtered data
→ UI displays results
```

### 2. URL Parameter Structure
```typescript
interface SearchParams {
  q?: string;           // Search query
  category?: string;    // Selected category
  brand?: string;       // Selected brand
  minPrice?: string;    // Minimum price
  maxPrice?: string;    // Maximum price
  inStock?: string;     // "true" or undefined
  sortBy?: string;      // "price" | "name" | "createdAt" | "rating"
  order?: string;       // "asc" | "desc"
  page?: string;        // Page number
}
```

### 3. Database Query Construction
```typescript
// Build Prisma where clause dynamically
const where: Prisma.ProductWhereInput = {
  AND: [
    // Search
    searchQuery ? {
      OR: [
        { name: { contains: searchQuery, mode: 'insensitive' } },
        { description: { contains: searchQuery, mode: 'insensitive' } },
        { brand: { contains: searchQuery, mode: 'insensitive' } },
      ]
    } : {},
    
    // Category filter
    category ? { category } : {},
    
    // Brand filter
    brand ? { brand } : {},
    
    // Price range
    minPrice || maxPrice ? {
      price: {
        ...(minPrice && { gte: minPrice }),
        ...(maxPrice && { lte: maxPrice }),
      }
    } : {},
    
    // Stock filter
    inStock === 'true' ? { stock: { gt: 0 } } : {},
  ].filter(clause => Object.keys(clause).length > 0)
};

// Build orderBy dynamically
const orderBy: Prisma.ProductOrderByWithRelationInput = {
  [sortBy || 'createdAt']: order || 'desc'
};
```

---

## 📦 Component Structure

### Component Hierarchy
```
app/(root)/shop/page.tsx (Server Component)
├── SearchBar (Client Component)
├── ProductFilters (Client Component)
│   ├── CategoryFilter (Client Component)
│   ├── BrandFilter (Client Component)
│   ├── PriceRangeFilter (Client Component)
│   └── StockFilter (Client Component)
├── ProductSort (Client Component)
├── ActiveFilters (Client Component)
└── ProductGrid (Server Component)
    └── ProductCard (Server Component)
```

### Component Responsibilities

#### `app/(root)/shop/page.tsx` (Server Component)
```typescript
// Responsibilities:
// - Parse URL search params
// - Call searchProducts server action
// - Pass data to child components
// - Handle pagination
// - Display loading/error states

export default async function ShopPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const params = await searchParams;
  
  const result = await searchProducts({
    query: params.q,
    category: params.category,
    brand: params.brand,
    minPrice: params.minPrice,
    maxPrice: params.maxPrice,
    inStock: params.inStock === 'true',
    sortBy: params.sortBy as SortField,
    order: params.order as SortOrder,
    page: Number(params.page) || 1,
  });
  
  return (
    <div>
      <SearchBar defaultValue={params.q} />
      <div className="flex gap-6">
        <ProductFilters 
          categories={result.categories}
          brands={result.brands}
          currentFilters={params}
        />
        <div>
          <ProductSort currentSort={params.sortBy} />
          <ActiveFilters filters={params} />
          <ProductGrid products={result.products} />
          <Pagination {...result.pagination} />
        </div>
      </div>
    </div>
  );
}
```

#### `components/shared/product/search-bar.tsx` (Client Component)
```typescript
// Responsibilities:
// - Accept user input
// - Debounce input changes (500ms)
// - Update URL with search query
// - Show clear button when has value

"use client";

export function SearchBar({ defaultValue }: { defaultValue?: string }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [value, setValue] = useState(defaultValue || "");
  
  // Debounced search
  useEffect(() => {
    const timer = setTimeout(() => {
      const params = new URLSearchParams(searchParams);
      if (value) {
        params.set("q", value);
      } else {
        params.delete("q");
      }
      params.set("page", "1"); // Reset to page 1 on search
      router.push(`${pathname}?${params.toString()}`);
    }, 500);
    
    return () => clearTimeout(timer);
  }, [value]);
  
  return (
    <div className="relative">
      <Input
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder="Search products..."
      />
      {value && (
        <Button onClick={() => setValue("")}>Clear</Button>
      )}
    </div>
  );
}
```

#### `components/shared/product/product-filters.tsx` (Client Component)
```typescript
// Responsibilities:
// - Display all filter options
// - Update URL when filters change
// - Show active filter state
// - Responsive (sidebar on desktop, sheet on mobile)

"use client";

export function ProductFilters({
  categories,
  brands,
  currentFilters,
}: {
  categories: CategoryCount[];
  brands: BrandCount[];
  currentFilters: SearchParams;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  
  const updateFilter = (key: string, value: string | null) => {
    const params = new URLSearchParams(searchParams);
    if (value) {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    params.set("page", "1"); // Reset to page 1 on filter change
    router.push(`${pathname}?${params.toString()}`);
  };
  
  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden md:block w-64 space-y-6">
        <CategoryFilter 
          categories={categories}
          selected={currentFilters.category}
          onChange={(val) => updateFilter("category", val)}
        />
        <BrandFilter 
          brands={brands}
          selected={currentFilters.brand}
          onChange={(val) => updateFilter("brand", val)}
        />
        <PriceRangeFilter 
          currentMin={currentFilters.minPrice}
          currentMax={currentFilters.maxPrice}
          onChange={(min, max) => {
            updateFilter("minPrice", min);
            updateFilter("maxPrice", max);
          }}
        />
        <StockFilter 
          checked={currentFilters.inStock === "true"}
          onChange={(val) => updateFilter("inStock", val ? "true" : null)}
        />
      </aside>
      
      {/* Mobile Filter Sheet */}
      <FilterSheet>
        {/* Same filter components */}
      </FilterSheet>
    </>
  );
}
```

#### `components/shared/product/active-filters.tsx` (Client Component)
```typescript
// Responsibilities:
// - Display active filters as badges
// - Allow clearing individual filters
// - Allow clearing all filters

"use client";

export function ActiveFilters({ filters }: { filters: SearchParams }) {
  const router = useRouter();
  const pathname = usePathname();
  
  const activeFilters = [];
  
  if (filters.q) activeFilters.push({ key: "q", label: `Search: ${filters.q}` });
  if (filters.category) activeFilters.push({ key: "category", label: filters.category });
  if (filters.brand) activeFilters.push({ key: "brand", label: filters.brand });
  // ... more filters
  
  const removeFilter = (key: string) => {
    const params = new URLSearchParams(window.location.search);
    params.delete(key);
    router.push(`${pathname}?${params.toString()}`);
  };
  
  const clearAll = () => {
    router.push(pathname);
  };
  
  if (activeFilters.length === 0) return null;
  
  return (
    <div className="flex flex-wrap gap-2">
      {activeFilters.map((filter) => (
        <Badge key={filter.key} variant="secondary">
          {filter.label}
          <button onClick={() => removeFilter(filter.key)}>×</button>
        </Badge>
      ))}
      <Button variant="ghost" size="sm" onClick={clearAll}>
        Clear All
      </Button>
    </div>
  );
}
```

---

## 🔌 Server Actions Design

### `lib/actions/product.actions.ts`

```typescript
"use server";

import { prisma } from "@/db/prisma";
import { convertToPlainObject } from "../utils";
import { Prisma } from "@prisma/client";

// Types
export type SortField = "price" | "name" | "createdAt" | "rating";
export type SortOrder = "asc" | "desc";

export interface SearchProductsParams {
  query?: string;
  category?: string;
  brand?: string;
  minPrice?: string;
  maxPrice?: string;
  inStock?: boolean;
  sortBy?: SortField;
  order?: SortOrder;
  page?: number;
  limit?: number;
}

export interface CategoryCount {
  category: string;
  count: number;
}

export interface BrandCount {
  brand: string;
  count: number;
}

// Main search function
export async function searchProducts(params: SearchProductsParams) {
  try {
    const {
      query,
      category,
      brand,
      minPrice,
      maxPrice,
      inStock,
      sortBy = "createdAt",
      order = "desc",
      page = 1,
      limit = 12,
    } = params;

    // Build where clause
    const where: Prisma.ProductWhereInput = {
      AND: [
        // Search query
        query
          ? {
              OR: [
                { name: { contains: query, mode: "insensitive" } },
                { description: { contains: query, mode: "insensitive" } },
                { brand: { contains: query, mode: "insensitive" } },
              ],
            }
          : {},

        // Category filter
        category ? { category } : {},

        // Brand filter
        brand ? { brand } : {},

        // Price range
        minPrice || maxPrice
          ? {
              price: {
                ...(minPrice && { gte: minPrice }),
                ...(maxPrice && { lte: maxPrice }),
              },
            }
          : {},

        // Stock filter
        inStock ? { stock: { gt: 0 } } : {},
      ].filter((clause) => Object.keys(clause).length > 0),
    };

    // Build orderBy
    const orderBy: Prisma.ProductOrderByWithRelationInput = {
      [sortBy]: order,
    };

    // Calculate pagination
    const skip = (page - 1) * limit;

    // Execute queries in parallel
    const [products, total, categories, brands] = await Promise.all([
      // Get products
      prisma.product.findMany({
        where,
        orderBy,
        skip,
        take: limit,
      }),

      // Get total count
      prisma.product.count({ where }),

      // Get categories with counts (for filter UI)
      prisma.product.groupBy({
        by: ["category"],
        _count: { category: true },
        orderBy: { category: "asc" },
      }),

      // Get brands with counts (for filter UI)
      prisma.product.groupBy({
        by: ["brand"],
        _count: { brand: true },
        orderBy: { brand: "asc" },
      }),
    ]);

    // Format results
    const formattedProducts = products.map((product) =>
      convertToPlainObject({
        ...product,
        price: product.price.toString(),
        rating: product.rating.toString(),
      })
    );

    const formattedCategories: CategoryCount[] = categories.map((c) => ({
      category: c.category,
      count: c._count.category,
    }));

    const formattedBrands: BrandCount[] = brands.map((b) => ({
      brand: b.brand,
      count: b._count.brand,
    }));

    return {
      success: true,
      data: {
        products: formattedProducts,
        total,
        pages: Math.ceil(total / limit),
        currentPage: page,
        categories: formattedCategories,
        brands: formattedBrands,
      },
    };
  } catch (error) {
    return {
      success: false,
      message: error instanceof Error ? error.message : "Search failed",
    };
  }
}

// Get all categories (cached)
export async function getAllCategories() {
  const categories = await prisma.product.groupBy({
    by: ["category"],
    _count: { category: true },
  });

  return categories.map((c) => ({
    name: c.category,
    count: c._count.category,
  }));
}

// Get all brands (cached)
export async function getAllBrands() {
  const brands = await prisma.product.groupBy({
    by: ["brand"],
    _count: { brand: true },
  });

  return brands.map((b) => ({
    name: b.brand,
    count: b._count.brand,
  }));
}

// Get price range distribution
export async function getPriceRanges() {
  const prices = await prisma.product.aggregate({
    _min: { price: true },
    _max: { price: true },
  });

  return {
    min: Number(prices._min.price || 0),
    max: Number(prices._max.price || 0),
  };
}
```

---

## 🎨 UI Component Details

### Filter Component Pattern
```typescript
// Reusable filter item component
interface FilterItemProps {
  label: string;
  value: string;
  count?: number;
  selected?: boolean;
  onClick: () => void;
}

export function FilterItem({ label, value, count, selected, onClick }: FilterItemProps) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "w-full text-left px-3 py-2 rounded hover:bg-accent",
        selected && "bg-accent font-medium"
      )}
    >
      <div className="flex justify-between items-center">
        <span>{label}</span>
        {count !== undefined && (
          <span className="text-sm text-muted-foreground">({count})</span>
        )}
      </div>
    </button>
  );
}
```

### Price Range Component
```typescript
export function PriceRangeFilter({ onChange }: { onChange: (min: string | null, max: string | null) => void }) {
  const ranges = [
    { label: "All Prices", min: null, max: null },
    { label: "Under $50", min: null, max: "50" },
    { label: "$50 - $100", min: "50", max: "100" },
    { label: "$100 - $200", min: "100", max: "200" },
    { label: "$200 - $500", min: "200", max: "500" },
    { label: "$500+", min: "500", max: null },
  ];

  return (
    <div className="space-y-2">
      <h3 className="font-semibold">Price Range</h3>
      {ranges.map((range) => (
        <FilterItem
          key={range.label}
          label={range.label}
          value={range.label}
          onClick={() => onChange(range.min, range.max)}
        />
      ))}
    </div>
  );
}
```

---

## 🔄 State Management

### URL as Single Source of Truth
- No local state for filters (except temporary search input)
- All filter state lives in URL parameters
- Components read from `useSearchParams()`
- Components update via `router.push()` with new params

### Benefits
- Shareable URLs
- Browser back/forward works
- Easy to implement
- No complex state management library needed
- SEO friendly

---

## ⚡ Performance Optimizations

### 1. Debouncing
```typescript
// Search input debounced to 500ms
const debouncedSearch = useMemo(
  () =>
    debounce((value: string) => {
      updateURL({ q: value });
    }, 500),
  []
);
```

### 2. Database Query Optimization
- Use indexes on filtered fields
- Select only needed fields
- Parallel queries with `Promise.all()`
- Limit result set

### 3. Caching
```typescript
// Cache category/brand lists
export const revalidate = 3600; // 1 hour

// In page.tsx
export const revalidate = 60; // Cache product pages for 1 minute
```

### 4. Pagination
- Limit results per page (12-24 products)
- Use offset pagination (`skip` and `take`)
- Consider cursor-based pagination for large datasets

---

## 🧪 Testing Strategy

### Unit Tests
- Test query builder logic
- Test filter URL parameter parsing
- Test individual filter components

### Integration Tests
- Test full search flow
- Test filter combinations
- Test pagination with filters
- Test URL synchronization

### E2E Tests
- User searches for product
- User applies multiple filters
- User sorts results
- User navigates pages
- User clears filters

---

## 📱 Responsive Design Strategy

### Breakpoints
```typescript
const breakpoints = {
  mobile: "max-width: 768px",
  tablet: "768px to 1024px",
  desktop: "min-width: 1024px",
};
```

### Mobile-First Approach
1. Build mobile filter sheet first
2. Expand to desktop sidebar
3. Test on real devices
4. Optimize touch targets (44px minimum)

---

## 🔐 Security Considerations

### Input Validation
```typescript
// Validate search query length
if (query && query.length > 100) {
  throw new Error("Search query too long");
}

// Validate price values
if (minPrice && isNaN(Number(minPrice))) {
  throw new Error("Invalid minimum price");
}

// Sanitize inputs (Prisma handles SQL injection)
```

### Rate Limiting
Consider implementing rate limiting for search endpoints if abuse is detected.

---

## 📊 Analytics Events to Track

```typescript
// Track search queries
analytics.track("product_search", {
  query: searchQuery,
  results_count: total,
});

// Track filter usage
analytics.track("filter_applied", {
  filter_type: "category",
  filter_value: category,
});

// Track sort usage
analytics.track("products_sorted", {
  sort_by: sortBy,
  order: order,
});
```

---

This design document provides the technical blueprint for implementing the search and filtering feature while following the project's established patterns.
