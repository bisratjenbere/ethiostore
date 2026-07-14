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
    <div className="relative w-full">
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
      <Input
        type="search"
        placeholder="Search products by name, brand, or description..."
        value={value}
        onChange={(e) => setValue(e.target.value)}
        className="pl-10 pr-10"
      />
      {value && (
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={handleClear}
          className="absolute right-1 top-1/2 -translate-y-1/2 h-7 w-7 p-0"
        >
          <X className="h-4 w-4" />
          <span className="sr-only">Clear search</span>
        </Button>
      )}
    </div>
  );
}
