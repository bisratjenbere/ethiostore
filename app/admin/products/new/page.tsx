import { Metadata } from "next";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import ProductForm from "@/components/admin/products/product-form";

export const metadata: Metadata = {
  title: "Add New Product",
};

export default function NewProductPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/admin/products">
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <div>
          <h1 className="text-3xl font-bold">Add New Product</h1>
          <p className="text-muted-foreground">
            Create a new product for your store
          </p>
        </div>
      </div>

      <div className="rounded-lg border bg-card p-6">
        <ProductForm type="create" />
      </div>
    </div>
  );
}
