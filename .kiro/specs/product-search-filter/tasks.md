# Product Search & Filtering - Implementation Tasks

## 📋 Task Breakdown

### Phase 1: Backend Foundation (Server Actions) ⚙️

#### Task 1.1: Extend Product Actions with Search/Filter
**File**: `lib/actions/product.actions.ts`

**Subtasks**:
- [ ] Add `SearchProductsParams` interface
- [ ] Implement `searchProducts()` server action
  - [ ] Build dynamic `where` clause based on params
  - [ ] Implement search across name, description, brand
  - [ ] Add category filter
  - [ ] Add brand filter
  - [ ] Add price range filter
  - [ ] Add stock filter
  - [ ] Implement dynamic sorting
  - [ ] Add pagination (skip/take)
- [ ] Implement `getAllCategories()` function with counts
- [ ] Implement `getAllBrands()` function with counts
- [ ] Implement `getPriceRanges()` function
- [ ] Convert Decimal fields to strings for client
- [ ] Add proper error handling
- [ ] Export TypeScript types

**Acceptance Criteria**:
- ✅ Can search products by text query
- ✅ Can filter by category, brand, price, stock
- ✅ Can sort by price, name, date
- ✅ Returns category and brand lists with counts
- ✅ Pagination works correctly
- ✅ Returns properly formatted data

**Estimated Time**: 2-3 hours

---

#### Task 1.2: Test Server Actions
**Tools**: Prisma Studio, API testing

**Subtasks**:
- [ ] Test search with various queries
- [ ] Test each filter individually
- [ ] Test combining multiple filters
- [ ] Test sorting options
- [ ] Test pagination
- [ ] Test edge cases (no results, empty query)
- [ ] Verify query performance in database logs

**Acceptance Criteria**:
- ✅ All filters work correctly
- ✅ Query performance is acceptable (< 500ms)
- ✅ Edge cases handled properly

**Estimated Time**: 1 hour

---

### Phase 2: Main Shop Page 🏪

#### Task 2.1: Create Shop Page
**File**: `app/(root)/shop/page.tsx`

**Subtasks**:
- [ ] Create server component page
- [ ] Parse search params from URL
- [ ] Call `searchProducts()` server action
- [ ] Handle loading state
- [ ] Handle error state
- [ ] Display product grid
- [ ] Add page metadata
- [ ] Implement pagination UI

**Code Structure**:
```typescript
export default async function ShopPage({
  searchParams,
}: {
  searchParams: Promise<{
    q?: string;
    category?: string;
    brand?: string;
    minPrice?: string;
    maxPrice?: string;
    inStock?: string;
    sortBy?: string;
    order?: string;
    page?: string;
  }>;
}) {
  const params = await searchParams;
  const result = await searchProducts({...});
  
  if (!result.success) {
    return <ErrorState message={result.message} />;
  }
  
  return (
    <div className="container mx-auto py-8">
      <div className="flex flex-col md:flex-row gap-6">
        <ProductFilters {...} />
        <div className="flex-1">
          <SearchBar {...} />
          <ProductSort {...} />
          <ActiveFilters {...} />
          <ProductGrid products={result.data.products} />
          <Pagination {...} />
        </div>
      </div>
    </div>
  );
}
```

**Acceptance Criteria**:
- ✅ Page displays filtered products
- ✅ URL parameters are properly parsed
- ✅ Loading and error states display
- ✅ Products display in grid layout

**Estimated Time**: 1-2 hours

---

### Phase 3: Search Component 🔍

#### Task 3.1: Create Search Bar Component
**File**: `components/shared/product/search-bar.tsx`

**Subtasks**:
- [ ] Create client component with "use client"
- [ ] Add search input field
- [ ] Implement debounced search (500ms)
- [ ] Update URL on search
- [ ] Add clear button when value exists
- [ ] Add search icon
- [ ] Style with Tailwind/shadcn
- [ ] Make responsive

**Code Pattern**:
```typescript
"use client";

export function SearchBar({ defaultValue }: { defaultValue?: string }) {
  const [value, setValue] = useState(defaultValue || "");
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    const timer = setTimeout(() => {
      const params = new URLSearchParams(searchParams);
      if (value) {
        params.set("q", value);
      } else {
        params.delete("q");
      }
      params.set("page", "1");
      router.push(`${pathname}?${params.toString()}`);
    }, 500);

    return () => clearTimeout(timer);
  }, [value]);

  return <Input value={value} onChange={...} />;
}
```

**Acceptance Criteria**:
- ✅ Search updates URL after 500ms delay
- ✅ Clear button works
- ✅ Responsive design
- ✅ Resets to page 1 on search

**Estimated Time**: 1 hour

---

#### Task 3.2: Add Search to Header (Optional)
**File**: `components/shared/header/index.tsx`

**Subtasks**:
- [ ] Add search bar to header
- [ ] Make it redirect to `/shop` with query
- [ ] Style appropriately
- [ ] Hide on mobile, show in menu

**Acceptance Criteria**:
- ✅ Search bar visible in header
- ✅ Redirects to shop page with query

**Estimated Time**: 30 minutes

---

### Phase 4: Filter Components 🎛️

#### Task 4.1: Create Base Filter Component
**File**: `components/shared/product/product-filters.tsx`

**Subtasks**:
- [ ] Create client component wrapper
- [ ] Accept categories, brands, current filters as props
- [ ] Create `updateFilter()` helper function
- [ ] Build desktop sidebar layout
- [ ] Build mobile filter sheet
- [ ] Add responsive switching (hide/show)
- [ ] Style with shadcn components

**Acceptance Criteria**:
- ✅ Shows sidebar on desktop
- ✅ Shows sheet on mobile
- ✅ Updates URL on filter change

**Estimated Time**: 2 hours

---

#### Task 4.2: Create Category Filter
**File**: `components/shared/product/category-filter.tsx`

**Subtasks**:
- [ ] Display list of categories
- [ ] Show product count per category
- [ ] Highlight selected category
- [ ] Add "All Categories" option
- [ ] Call onChange when clicked
- [ ] Style with hover states

**Acceptance Criteria**:
- ✅ Lists all categories
- ✅ Shows counts
- ✅ Updates filter on click

**Estimated Time**: 45 minutes

---

#### Task 4.3: Create Brand Filter
**File**: `components/shared/product/brand-filter.tsx`

**Subtasks**:
- [ ] Display list of brands
- [ ] Show product count per brand
- [ ] Highlight selected brand
- [ ] Add "All Brands" option
- [ ] Call onChange when clicked
- [ ] Style consistently with category

**Acceptance Criteria**:
- ✅ Lists all brands
- ✅ Shows counts
- ✅ Updates filter on click

**Estimated Time**: 45 minutes

---

#### Task 4.4: Create Price Range Filter
**File**: `components/shared/product/price-range-filter.tsx`

**Subtasks**:
- [ ] Define price ranges (Under $50, $50-$100, etc.)
- [ ] Display as radio buttons or buttons
- [ ] Highlight selected range
- [ ] Add "All Prices" option
- [ ] Call onChange with min/max values
- [ ] Style consistently

**Acceptance Criteria**:
- ✅ Shows price ranges
- ✅ Updates filter with min/max
- ✅ Visual feedback for selection

**Estimated Time**: 45 minutes

---

#### Task 4.5: Create Stock Filter
**File**: `components/shared/product/stock-filter.tsx`

**Subtasks**:
- [ ] Create checkbox for "In Stock Only"
- [ ] Update URL on change
- [ ] Show checked state from URL
- [ ] Style with shadcn checkbox

**Acceptance Criteria**:
- ✅ Checkbox toggles filter
- ✅ Filters products correctly

**Estimated Time**: 30 minutes

---

#### Task 4.6: Create Filter Item Component (Reusable)
**File**: `components/shared/product/filter-item.tsx`

**Subtasks**:
- [ ] Create reusable filter button
- [ ] Accept label, value, count, selected
- [ ] Style with hover and active states
- [ ] Make accessible (keyboard navigation)

**Acceptance Criteria**:
- ✅ Reusable across filters
- ✅ Keyboard accessible
- ✅ Visual feedback

**Estimated Time**: 30 minutes

---

### Phase 5: Sort & Display Components 📊

#### Task 5.1: Create Sort Component
**File**: `components/shared/product/product-sort.tsx`

**Subtasks**:
- [ ] Create dropdown with sort options
- [ ] Options: Newest, Price (Low/High), Name (A-Z/Z-A)
- [ ] Update URL on selection
- [ ] Show current sort option
- [ ] Use shadcn Select component

**Acceptance Criteria**:
- ✅ Dropdown shows all sort options
- ✅ Updates URL correctly
- ✅ Reflects current sort

**Estimated Time**: 1 hour

---

#### Task 5.2: Create Active Filters Display
**File**: `components/shared/product/active-filters.tsx`

**Subtasks**:
- [ ] Display active filters as badges
- [ ] Add remove button per filter
- [ ] Add "Clear All" button
- [ ] Update URL on removal
- [ ] Hide when no filters active
- [ ] Style with shadcn Badge

**Acceptance Criteria**:
- ✅ Shows all active filters
- ✅ Can remove individual filters
- ✅ Can clear all filters
- ✅ Hides when empty

**Estimated Time**: 1 hour

---

#### Task 5.3: Create Filter Sheet for Mobile
**File**: `components/shared/product/product-filters-mobile.tsx`

**Subtasks**:
- [ ] Create Sheet component from shadcn
- [ ] Add trigger button (Filter button)
- [ ] Include all filter components
- [ ] Add "Apply Filters" button
- [ ] Add "Clear Filters" button
- [ ] Show active filter count on button
- [ ] Make scrollable

**Acceptance Criteria**:
- ✅ Opens from button
- ✅ Contains all filters
- ✅ Applies on button click
- ✅ Works on mobile devices

**Estimated Time**: 1.5 hours

---

### Phase 6: Product Grid & Pagination 📄

#### Task 6.1: Update Product Grid Component
**File**: `components/shared/product/product-list.tsx` (modify)

**Subtasks**:
- [ ] Accept filtered products
- [ ] Display in responsive grid
- [ ] Show "No products found" when empty
- [ ] Add loading skeleton
- [ ] Optimize for performance

**Acceptance Criteria**:
- ✅ Displays products in grid
- ✅ Handles empty state
- ✅ Responsive layout

**Estimated Time**: 30 minutes

---

#### Task 6.2: Create Pagination Component
**File**: `components/shared/pagination.tsx`

**Subtasks**:
- [ ] Create pagination UI
- [ ] Show current page
- [ ] Show total pages
- [ ] Previous/Next buttons
- [ ] Page number buttons (limited range)
- [ ] Update URL on page change
- [ ] Disable at boundaries
- [ ] Style with shadcn Button

**Acceptance Criteria**:
- ✅ Shows page numbers
- ✅ Previous/Next work
- ✅ Updates URL correctly
- ✅ Disabled states work

**Estimated Time**: 1.5 hours

---

### Phase 7: UI/UX Polish ✨

#### Task 7.1: Add Loading States
**Files**: Various components

**Subtasks**:
- [ ] Add skeleton loaders for product grid
- [ ] Add loading indicator for search
- [ ] Add loading state for filter changes
- [ ] Use Suspense boundaries where appropriate

**Acceptance Criteria**:
- ✅ Loading states show during data fetch
- ✅ Smooth transitions

**Estimated Time**: 1 hour

---

#### Task 7.2: Add Empty States
**Files**: Various components

**Subtasks**:
- [ ] "No products found" message
- [ ] Suggestion to clear filters
- [ ] Friendly illustration or icon
- [ ] Link back to all products

**Acceptance Criteria**:
- ✅ Shows when no results
- ✅ Helpful messaging

**Estimated Time**: 30 minutes

---

#### Task 7.3: Improve Responsiveness
**Files**: All components

**Subtasks**:
- [ ] Test on mobile devices
- [ ] Adjust spacing and sizing
- [ ] Ensure touch targets are 44px+
- [ ] Test filter sheet on mobile
- [ ] Optimize grid columns per breakpoint

**Acceptance Criteria**:
- ✅ Works on all screen sizes
- ✅ Touch-friendly on mobile

**Estimated Time**: 1 hour

---

#### Task 7.4: Accessibility Improvements
**Files**: All components

**Subtasks**:
- [ ] Add proper ARIA labels
- [ ] Keyboard navigation works
- [ ] Focus states visible
- [ ] Screen reader announcements
- [ ] Semantic HTML

**Acceptance Criteria**:
- ✅ Keyboard accessible
- ✅ Screen reader friendly

**Estimated Time**: 1 hour

---

### Phase 8: Testing & Optimization 🧪

#### Task 8.1: Manual Testing
**Subtasks**:
- [ ] Test all filter combinations
- [ ] Test search with various queries
- [ ] Test pagination
- [ ] Test sorting
- [ ] Test on mobile devices
- [ ] Test browser back/forward buttons
- [ ] Test clearing filters
- [ ] Test sharing filtered URLs

**Acceptance Criteria**:
- ✅ All features work correctly
- ✅ No bugs found

**Estimated Time**: 2 hours

---

#### Task 8.2: Performance Optimization
**Subtasks**:
- [ ] Check database query performance
- [ ] Verify indexes are used
- [ ] Check bundle size
- [ ] Optimize images in results
- [ ] Test with large dataset

**Acceptance Criteria**:
- ✅ Page loads in < 2 seconds
- ✅ Filter changes in < 500ms
- ✅ Database queries optimized

**Estimated Time**: 1.5 hours

---

#### Task 8.3: Fix Issues
**Subtasks**:
- [ ] Address bugs found in testing
- [ ] Improve UX based on testing
- [ ] Optimize slow queries
- [ ] Fix responsive issues

**Estimated Time**: 2-4 hours (depends on issues)

---

### Phase 9: Documentation & Deployment 📚

#### Task 9.1: Update Documentation
**Files**: README.md, project docs

**Subtasks**:
- [ ] Document search/filter feature
- [ ] Add usage examples
- [ ] Update project status
- [ ] Add screenshots
- [ ] Document URL parameter structure

**Acceptance Criteria**:
- ✅ Feature documented
- ✅ Examples provided

**Estimated Time**: 30 minutes

---

#### Task 9.2: Navigation Updates
**Files**: Header, homepage, etc.

**Subtasks**:
- [ ] Add "Shop" link to main navigation
- [ ] Add "Browse All Products" button on homepage
- [ ] Update footer links if needed
- [ ] Ensure mobile menu includes Shop

**Acceptance Criteria**:
- ✅ Easy to navigate to shop page
- ✅ Visible in all layouts

**Estimated Time**: 30 minutes

---

## 📊 Summary

### Total Estimated Time: **25-30 hours**

### Priority Breakdown:
- **Phase 1 (Backend)**: CRITICAL - Must be first
- **Phase 2 (Shop Page)**: CRITICAL - Core feature
- **Phase 3 (Search)**: HIGH - Key functionality
- **Phase 4 (Filters)**: HIGH - Key functionality
- **Phase 5 (Sort/Display)**: MEDIUM - Enhancement
- **Phase 6 (Grid/Pagination)**: HIGH - Core feature
- **Phase 7 (Polish)**: MEDIUM - UX improvement
- **Phase 8 (Testing)**: HIGH - Quality assurance
- **Phase 9 (Docs)**: LOW - Final touches

### Suggested Implementation Order:
1. Backend (Phase 1) - Day 1
2. Shop Page + Search (Phase 2-3) - Day 2
3. Filters (Phase 4) - Day 3-4
4. Sort + Pagination (Phase 5-6) - Day 4-5
5. Polish + Testing (Phase 7-8) - Day 5-6
6. Documentation (Phase 9) - Day 6

### Dependencies:
- Phase 2 depends on Phase 1
- Phase 3-6 can be done in parallel after Phase 2
- Phase 7 requires all previous phases
- Phase 8 requires Phase 7
- Phase 9 is final

---

## ✅ Checklist for Completion

- [ ] All server actions implemented and tested
- [ ] Shop page created and functional
- [ ] Search bar works with debouncing
- [ ] All filter components created
- [ ] Sort dropdown works
- [ ] Active filters display works
- [ ] Mobile filter sheet works
- [ ] Pagination works
- [ ] Loading states implemented
- [ ] Empty states implemented
- [ ] Responsive on all devices
- [ ] Accessibility requirements met
- [ ] Performance optimized
- [ ] Manual testing complete
- [ ] Documentation updated
- [ ] Navigation updated

---

*Follow the coding standards and patterns defined in `.kiro/steering/` directory while implementing these tasks.*
