import { Metadata } from "next";
import Link from "next/link";
import { getAllProducts } from "@/lib/actions/admin.actions";
import AdminProductsTable from "@/components/admin/products/admin-products-table";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { Suspense } from "react";

export const metadata: Metadata = {
  title: "Product Management",
};

export default async function AdminProductsPage({
  searchParams,
}: {
  searchParams: Promise<{
    page?: string;
    category?: string;
    brand?: string;
    inStock?: string;
    search?: string;
  }>;
}) {
  const params = await searchParams;
  const page = params.page || "1";
  const category = params.category || "all";
  const brand = params.brand || "all";
  const inStock = params.inStock || "all";
  const search = params.search || "";

  const result = await getAllProducts({
    page: Number(page),
    limit: 20,
    category,
    brand,
    inStock,
    search,
  });

  if (!result.success || !result.data) {
    return (
      <div className="space-y-6">
        <h1 className="text-3xl font-bold">Product Management</h1>
        <div className="rounded-lg border border-destructive bg-destructive/10 p-4">
          <p className="text-destructive">{result.message}</p>
        </div>
      </div>
    );
  }

  const { products, total, pages, currentPage } = result.data;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Product Management</h1>
          <p className="text-muted-foreground">
            Manage your products ({total} total)
          </p>
        </div>
        <Button asChild>
          <Link href="/admin/products/new">
            <Plus className="mr-2 h-4 w-4" />
            Add Product
          </Link>
        </Button>
      </div>

      <Suspense fallback={<div>Loading...</div>}>
        <AdminProductsTable
          products={products}
          currentPage={currentPage}
          totalPages={pages}
          filters={{
            category,
            brand,
            inStock,
            search,
          }}
        />
      </Suspense>
    </div>
  );
}
