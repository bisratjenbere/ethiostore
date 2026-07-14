import { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import ProductForm from "@/components/admin/products/product-form";
import { getProductById } from "@/lib/actions/admin.actions";

export const metadata: Metadata = {
  title: "Edit Product",
};

export default async function EditProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const result = await getProductById(id);

  if (!result.success || !result.data) {
    notFound();
  }

  const product = result.data;

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild>
          <Link href={`/admin/products/${id}`}>
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <div>
          <h1 className="text-3xl font-bold">Edit Product</h1>
          <p className="text-muted-foreground">{product.name}</p>
        </div>
      </div>

      <div className="rounded-lg border bg-card p-6">
        <ProductForm type="update" product={product} />
      </div>
    </div>
  );
}
