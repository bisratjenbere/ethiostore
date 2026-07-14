import { Metadata } from "next";
import { searchProducts } from "@/lib/actions/product.actions";
import SearchBar from "@/components/shared/product/search-bar";
import ProductFilters from "@/components/shared/product/product-filters";
import ProductSort from "@/components/shared/product/product-sort";
import ActiveFilters from "@/components/shared/product/active-filters";
import ProductGrid from "@/components/shared/product/product-grid";
import Pagination from "@/components/shared/pagination";

export const metadata: Metadata = {
  title: "Shop - Browse All Products",
  description: "Browse our complete product catalog with search and filters",
};

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

  // Parse search parameters
  const filters = {
    query: params.q,
    category: params.category,
    brand: params.brand,
    minPrice: params.minPrice,
    maxPrice: params.maxPrice,
    inStock: params.inStock === "true",
    sortBy: (params.sortBy as any) || "createdAt",
    order: (params.order as any) || "desc",
    page: Number(params.page) || 1,
  };

  // Fetch filtered products
  const result = await searchProducts(filters);

  if (!result.success) {
    return (
      <div className="wrapper py-8">
        <div className="space-y-6">
          <h1 className="h2-bold">Shop</h1>
          <div className="rounded-lg border border-destructive bg-destructive/10 p-6">
            <p className="text-destructive">
              Error loading products: {result.message}
            </p>
          </div>
        </div>
      </div>
    );
  }

  const { products, total, pages, currentPage, categories, brands } =
    result.data!;

  return (
    <div className="wrapper py-8">
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="h2-bold">Shop</h1>
          <p className="text-muted-foreground mt-2">
            Browse our collection of {total} {total === 1 ? 'product' : 'products'}
          </p>
        </div>

        {/* Search Bar */}
        <SearchBar defaultValue={params.q} />

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Filters Sidebar */}
          <ProductFilters
            categories={categories}
            brands={brands}
            currentFilters={params}
          />

          {/* Main Content */}
          <div className="flex-1 space-y-6">
            {/* Sort and Active Filters */}
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <ProductSort
                  currentSort={params.sortBy}
                  currentOrder={params.order}
                />
              </div>
              <ActiveFilters filters={params} />
            </div>

            {/* Product Grid */}
            <ProductGrid products={products} />

            {/* Pagination */}
            {pages > 1 && (
              <div className="flex justify-center pt-4">
                <Pagination
                  currentPage={currentPage}
                  totalPages={pages}
                  baseUrl="/shop"
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
