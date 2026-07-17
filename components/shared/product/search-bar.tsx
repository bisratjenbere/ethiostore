"use client";

import { useState, useEffect } from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, X } from "lucide-react";

export default function SearchBar({ defaultValue }: { defaultValue?: string }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [value, setValue] = useState(defaultValue || "");

  // Debounced search - update URL after 500ms of no typing
  useEffect(() => {
    const timer = setTimeout(() => {
      const params = new URLSearchParams(searchParams.toString());
      
      if (value.trim()) {
        params.set("q", value.trim());
      } else {
        params.delete("q");
      }
      
      // Reset to page 1 when search changes
      params.set("page", "1");
      
      router.push(`${pathname}?${params.toString()}`);
    }, 500);

    return () => clearTimeout(timer);
  }, [value, pathname, router, searchParams]);

  const handleClear = () => {
    setValue("");
  };

  return (
    <div className="relative w-full max-w-2xl">
      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground pointer-events-none" />
        <Input
          type="search"
          placeholder="Search products by name, brand, or description..."
          value={value}
          onChange={(e) => setValue(e.target.value)}
          className="pl-12 pr-12 h-12 text-base border-2 focus:border-primary transition-colors"
        />
        {value && (
          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={handleClear}
            className="absolute right-2 top-1/2 -translate-y-1/2 h-8 w-8 hover:bg-muted"
          >
            <X className="h-4 w-4" />
            <span className="sr-only">Clear search</span>
          </Button>
        )}
      </div>
      {value && (
        <p className="text-xs text-muted-foreground mt-2 ml-1">
          Searching for &quot;{value}&quot;...
        </p>
      )}
    </div>
  );
}
