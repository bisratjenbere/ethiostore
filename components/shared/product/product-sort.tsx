"use client";

import { useRouter, usePathname, useSearchParams } from "next/navigation";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface ProductSortProps {
  currentSort?: string;
  currentOrder?: string;
}

export default function ProductSort({
  currentSort = "createdAt",
  currentOrder = "desc",
}: ProductSortProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const sortValue = `${currentSort}-${currentOrder}`;

  const handleSortChange = (value: string) => {
    const [sortBy, order] = value.split("-");
    const params = new URLSearchParams(searchParams.toString());
    
    params.set("sortBy", sortBy);
    params.set("order", order);
    params.set("page", "1");
    
    router.push(`${pathname}?${params.toString()}`);
  };

  return (
    <div className="flex items-center gap-2">
      <span className="text-sm text-muted-foreground">Sort by:</span>
      <Select value={sortValue} onValueChange={handleSortChange}>
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Sort by" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="createdAt-desc">Newest First</SelectItem>
          <SelectItem value="price-asc">Price: Low to High</SelectItem>
          <SelectItem value="price-desc">Price: High to Low</SelectItem>
          <SelectItem value="name-asc">Name: A-Z</SelectItem>
          <SelectItem value="name-desc">Name: Z-A</SelectItem>
          <SelectItem value="rating-desc">Rating: High to Low</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}
