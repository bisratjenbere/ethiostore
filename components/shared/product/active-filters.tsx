"use client";

import { useRouter, usePathname } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";

interface ActiveFiltersProps {
  filters: {
    q?: string;
    category?: string;
    brand?: string;
    minPrice?: string;
    maxPrice?: string;
    inStock?: string;
  };
}

export default function ActiveFilters({ filters }: ActiveFiltersProps) {
  const router = useRouter();
  const pathname = usePathname();

  const activeFilters: Array<{ key: string; label: string; value: string }> =
    [];

  if (filters.q) {
    activeFilters.push({ key: "q", label: "Search", value: filters.q });
  }
  if (filters.category && filters.category !== "all") {
    activeFilters.push({
      key: "category",
      label: "Category",
      value: filters.category,
    });
  }
  if (filters.brand && filters.brand !== "all") {
    activeFilters.push({ key: "brand", label: "Brand", value: filters.brand });
  }
  if (filters.minPrice || filters.maxPrice) {
    const priceLabel =
      filters.minPrice && filters.maxPrice
        ? `$${filters.minPrice} - $${filters.maxPrice}`
        : filters.minPrice
        ? `Over $${filters.minPrice}`
        : `Under $${filters.maxPrice}`;
    activeFilters.push({
      key: "price",
      label: "Price",
      value: priceLabel,
    });
  }
  if (filters.inStock === "true") {
    activeFilters.push({
      key: "inStock",
      label: "In Stock",
      value: "Yes",
    });
  }

  const removeFilter = (key: string) => {
    const params = new URLSearchParams(window.location.search);
    
    if (key === "price") {
      params.delete("minPrice");
      params.delete("maxPrice");
    } else {
      params.delete(key);
    }
    
    params.set("page", "1");
    router.push(`${pathname}?${params.toString()}`);
  };

  const clearAll = () => {
    router.push(pathname);
  };

  if (activeFilters.length === 0) {
    return null;
  }

  return (
    <div className="flex flex-wrap items-center gap-2">
      <span className="text-sm font-medium">Active Filters:</span>
      {activeFilters.map((filter) => (
        <Badge
          key={filter.key}
          variant="secondary"
          className="pl-3 pr-1 py-1 gap-1"
        >
          <span className="text-xs">
            {filter.label}: {filter.value}
          </span>
          <Button
            variant="ghost"
            size="sm"
            className="h-4 w-4 p-0 hover:bg-transparent"
            onClick={() => removeFilter(filter.key)}
          >
            <X className="h-3 w-3" />
            <span className="sr-only">Remove {filter.label} filter</span>
          </Button>
        </Badge>
      ))}
      <Button
        variant="ghost"
        size="sm"
        onClick={clearAll}
        className="h-7 text-xs"
      >
        Clear All
      </Button>
    </div>
  );
}
