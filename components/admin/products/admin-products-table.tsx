"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { FormatCurrency } from "@/lib/utils";
import ProductActions from "./product-actions";
import { Search } from "lucide-react";

type Product = {
  id: string;
  name: string;
  slug: string;
  category: string;
  brand: string;
  price: string;
  stock: number;
  images: string[];
  isFeatured: boolean;
};

type AdminProductsTableProps = {
  products: Product[];
  currentPage: number;
  totalPages: number;
  filters: {
    category: string;
    brand: string;
    inStock: string;
    search: string;
  };
};

// Helper function to validate image URL
const isValidImageUrl = (url: string | null | undefined): url is string => {
  if (!url || typeof url !== 'string') return false;
  const trimmed = url.trim();
  return trimmed.length > 0 && (trimmed.startsWith('/') || trimmed.startsWith('http'));
};

export default function AdminProductsTable({
  products,
  currentPage,
  totalPages,
  filters,
}: AdminProductsTableProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [searchValue, setSearchValue] = useState(filters.search);

  const updateFilters = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value && value !== "all") {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    // Reset to page 1 when filtering
    if (key !== "page") {
      params.set("page", "1");
    }
    router.push(`/admin/products?${params.toString()}`);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    updateFilters("search", searchValue);
  };

  const goToPage = (page: number) => {
    updateFilters("page", page.toString());
  };

  if (products.length === 0) {
    return (
      <div className="space-y-4">
        {/* Search Bar */}
        <form onSubmit={handleSearch} className="flex gap-2">
          <Input
            placeholder="Search by product name or slug..."
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            className="flex-1"
          />
          <Button type="submit" size="icon">
            <Search className="h-4 w-4" />
          </Button>
        </form>

        <div className="rounded-lg border bg-card p-12 text-center">
          <p className="text-muted-foreground">No products found</p>
          {filters.search && (
            <Button
              variant="link"
              onClick={() => router.push("/admin/products")}
              className="mt-2"
            >
              Clear search
            </Button>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Search Bar */}
      <form onSubmit={handleSearch} className="flex gap-2">
        <Input
          placeholder="Search by product name or slug..."
          value={searchValue}
          onChange={(e) => setSearchValue(e.target.value)}
          className="flex-1"
        />
        <Button type="submit" size="icon">
          <Search className="h-4 w-4" />
        </Button>
      </form>

      {/* Table */}
      <div className="rounded-lg border bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Image</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Brand</TableHead>
              <TableHead>Price</TableHead>
              <TableHead>Stock</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {products.map((product) => {
              const firstValidImage = product.images?.find(isValidImageUrl);
              
              return (
              <TableRow key={product.id}>
                <TableCell>
                  <div className="relative h-16 w-16 bg-muted rounded">
                    {firstValidImage ? (
                      <Image
                        src={firstValidImage}
                        alt={product.name}
                        fill
                        className="rounded object-cover"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center text-xs text-muted-foreground">
                        No Image
                      </div>
                    )}
                  </div>
                </TableCell>
                <TableCell>
                  <div>
                    <div className="font-medium">{product.name}</div>
                    <div className="text-sm text-muted-foreground">
                      {product.slug}
                    </div>
                  </div>
                </TableCell>
                <TableCell>{product.category}</TableCell>
                <TableCell>{product.brand}</TableCell>
                <TableCell className="font-medium">
                  {FormatCurrency(Number(product.price))}
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <span>{product.stock}</span>
                    {product.stock === 0 && (
                      <Badge variant="destructive">Out of Stock</Badge>
                    )}
                    {product.stock > 0 && product.stock < 10 && (
                      <Badge variant="outline" className="bg-yellow-100">
                        Low Stock
                      </Badge>
                    )}
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" asChild>
                      <Link href={`/admin/products/${product.id}`}>View</Link>
                    </Button>
                    <Button variant="outline" size="sm" asChild>
                      <Link href={`/admin/products/${product.id}/edit`}>
                        Edit
                      </Link>
                    </Button>
                    <ProductActions product={product} />
                  </div>
                </TableCell>
              </TableRow>
            );
            })}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => goToPage(currentPage - 1)}
            disabled={currentPage === 1}
          >
            Previous
          </Button>
          <div className="flex gap-1">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <Button
                key={page}
                variant={page === currentPage ? "default" : "outline"}
                size="sm"
                onClick={() => goToPage(page)}
              >
                {page}
              </Button>
            ))}
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => goToPage(currentPage + 1)}
            disabled={currentPage === totalPages}
          >
            Next
          </Button>
        </div>
      )}
    </div>
  );
}
