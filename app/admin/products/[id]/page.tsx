import { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { prisma } from "@/db/prisma";
import { auth } from "@/auth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Edit } from "lucide-react";
import { FormatCurrency, convertToPlainObject } from "@/lib/utils";
import ProductActions from "@/components/admin/products/product-actions";

export const metadata: Metadata = {
  title: "Product Details",
};

export default async function AdminProductDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const session = await auth();

  // Verify admin access
  if (session?.user?.role !== "admin") {
    notFound();
  }

  // Fetch product
  const product = await prisma.product.findUnique({
    where: { id },
  });

  if (!product) {
    notFound();
  }

  // Convert to plain object with formatted decimals
  const formattedProduct = convertToPlainObject({
    ...product,
    price: product.price.toString(),
    rating: product.rating.toString(),
  }) as typeof product & { price: string; rating: string; updatedAt: Date };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" asChild>
            <Link href="/admin/products">
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </Button>
          <div>
            <h1 className="text-3xl font-bold">Product Details</h1>
            <p className="text-sm text-muted-foreground">{product.slug}</p>
          </div>
        </div>

        <div className="flex gap-2">
          <Button asChild>
            <Link href={`/admin/products/${id}/edit`}>
              <Edit className="mr-2 h-4 w-4" />
              Edit
            </Link>
          </Button>
          <ProductActions product={formattedProduct} />
        </div>
      </div>

      {/* Status Badges */}
      <div className="flex gap-2">
        {product.isFeatured && (
          <Badge variant="outline" className="bg-purple-100">
            Featured
          </Badge>
        )}
        {product.stock === 0 && <Badge variant="destructive">Out of Stock</Badge>}
        {product.stock > 0 && product.stock < 10 && (
          <Badge variant="outline" className="bg-yellow-100">
            Low Stock
          </Badge>
        )}
        {product.stock >= 10 && (
          <Badge variant="outline" className="bg-green-100">
            In Stock
          </Badge>
        )}
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <div className="space-y-6 md:col-span-2">
          {/* Product Images */}
          <Card>
            <CardHeader>
              <CardTitle>Product Images</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
                {product.images.map((image, index) => (
                  <div
                    key={index}
                    className="relative aspect-square overflow-hidden rounded-lg border"
                  >
                    <Image
                      src={image}
                      alt={`${product.name} - Image ${index + 1}`}
                      fill
                      className="object-cover"
                    />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Product Description */}
          <Card>
            <CardHeader>
              <CardTitle>Description</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="whitespace-pre-wrap text-sm">
                {product.description}
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          {/* Basic Information */}
          <Card>
            <CardHeader>
              <CardTitle>Basic Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <div className="text-sm font-medium">Name</div>
                <div className="text-sm text-muted-foreground">
                  {product.name}
                </div>
              </div>
              <div>
                <div className="text-sm font-medium">Category</div>
                <div className="text-sm text-muted-foreground">
                  {product.category}
                </div>
              </div>
              <div>
                <div className="text-sm font-medium">Brand</div>
                <div className="text-sm text-muted-foreground">
                  {product.brand}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Pricing & Inventory */}
          <Card>
            <CardHeader>
              <CardTitle>Pricing & Inventory</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <div className="text-sm font-medium">Price</div>
                <div className="text-lg font-bold">
                  {FormatCurrency(Number(product.price))}
                </div>
              </div>
              <div>
                <div className="text-sm font-medium">Stock</div>
                <div className="text-sm text-muted-foreground">
                  {product.stock} units
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Reviews & Ratings */}
          <Card>
            <CardHeader>
              <CardTitle>Reviews & Ratings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <div className="text-sm font-medium">Rating</div>
                <div className="text-sm text-muted-foreground">
                  {Number(product.rating).toFixed(1)} / 5.0
                </div>
              </div>
              <div>
                <div className="text-sm font-medium">Number of Reviews</div>
                <div className="text-sm text-muted-foreground">
                  {product.numReviews}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Timestamps */}
          <Card>
            <CardHeader>
              <CardTitle>Timestamps</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <div className="text-sm font-medium">Created</div>
                <div className="text-sm text-muted-foreground">
                  {new Date(formattedProduct.createdAt).toLocaleString()}
                </div>
              </div>
              {formattedProduct.updatedAt && (
                <div>
                  <div className="text-sm font-medium">Last Updated</div>
                  <div className="text-sm text-muted-foreground">
                    {new Date(formattedProduct.updatedAt).toLocaleString()}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
