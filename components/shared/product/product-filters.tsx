"use client";

import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Filter } from "lucide-react";
import CategoryFilter from "./category-filter";
import BrandFilter from "./brand-filter";
import PriceRangeFilter from "./price-range-filter";
import StockFilter from "./stock-filter";
import type { CategoryCount, BrandCount } from "@/lib/actions/product.actions";

interface ProductFiltersProps {
  categories: CategoryCount[];
  brands: BrandCount[];
  currentFilters: {
    category?: string;
    brand?: string;
    minPrice?: string;
    maxPrice?: string;
    inStock?: string;
  };
}

export default function ProductFilters({
  categories,
  brands,
  currentFilters,
}: ProductFiltersProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const updateFilter = (key: string, value: string | null) => {
    const params = new URLSearchParams(searchParams.toString());
    
    if (value && value !== "all") {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    
    // Reset to page 1 when filter changes
    params.set("page", "1");
    
    router.push(`${pathname}?${params.toString()}`);
  };

  const updatePriceRange = (min: string | null, max: string | null) => {
    const params = new URLSearchParams(searchParams.toString());
    
    if (min) {
      params.set("minPrice", min);
    } else {
      params.delete("minPrice");
    }
    
    if (max) {
      params.set("maxPrice", max);
    } else {
      params.delete("maxPrice");
    }
    
    params.set("page", "1");
    router.push(`${pathname}?${params.toString()}`);
  };

  const FilterContent = () => (
    <div className="space-y-6">
      <CategoryFilter
        categories={categories}
        selected={currentFilters.category}
        onChange={(value) => updateFilter("category", value)}
      />
      
      <BrandFilter
        brands={brands}
        selected={currentFilters.brand}
        onChange={(value) => updateFilter("brand", value)}
      />
      
      <PriceRangeFilter
        currentMin={currentFilters.minPrice}
        currentMax={currentFilters.maxPrice}
        onChange={updatePriceRange}
      />
      
      <StockFilter
        checked={currentFilters.inStock === "true"}
        onChange={(checked) => updateFilter("inStock", checked ? "true" : null)}
      />
    </div>
  );

  return (
    <>
      {/* Mobile Filter Button & Sheet */}
      <div className="lg:hidden mb-4">
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="outline" className="w-full">
              <Filter className="mr-2 h-4 w-4" />
              Filters
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-80 overflow-y-auto">
            <SheetHeader>
              <SheetTitle>Filters</SheetTitle>
            </SheetHeader>
            <div className="mt-6">
              <FilterContent />
            </div>
          </SheetContent>
        </Sheet>
      </div>

      {/* Desktop Sidebar */}
      <aside className="hidden lg:block w-64 flex-shrink-0">
        <div className="sticky top-4">
          <h2 className="text-lg font-semibold mb-4">Filters</h2>
          <FilterContent />
        </div>
      </aside>
    </>
  );
}
