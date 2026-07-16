import ProductImages from "@/components/shared/product/product-images";
import ProductPrice from "@/components/shared/product/product-price";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import AddToCartWrapper from "@/components/shared/product/add-to-cart-wrapper";
import ReviewSection from "@/components/shared/product/review-section";
import { notFound } from "next/navigation";
import { getProductBySlug, getAllProductSlugs } from "@/lib/actions/product.actions";
import { ChevronRight, Package, Star, Truck } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { Metadata } from "next";
import { APP_NAME } from "@/lib/constants";

// Enable ISR with 5 minute revalidation
export const revalidate = 300;

// Generate metadata for SEO
export async function generateMetadata(props: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const params = await props.params;
  const product = await getProductBySlug(params.slug);
  
  if (!product) {
    return {
      title: "Product Not Found",
    };
  }
  
  return {
    title: `${product.name} - ${APP_NAME}`,
    description: product.description,
    openGraph: {
      title: product.name,
      description: product.description,
      images: product.images && product.images.length > 0 ? [product.images[0] as string] : [],
    },
  };
}

// Pre-generate top products at build time
export async function generateStaticParams() {
  const slugs = await getAllProductSlugs();
  return slugs.map((slug) => ({ slug }));
}

const ProductDetailsPage = async (props: {
  params: Promise<{ slug: string }>;
}) => {
  const params = await props.params;
  const { slug } = params;
  const product = await getProductBySlug(slug);
  if (!product) notFound();
  const rating = Number(product.rating);

  return (
    <div className="wrapper py-8">
      {/* Breadcrumbs */}
      <nav className="flex items-center gap-2 text-sm text-muted-foreground mb-6">
        <Link href="/" className="hover:text-foreground transition-colors">
          Home
        </Link>
        <ChevronRight className="h-4 w-4" />
        <Link href="/shop" className="hover:text-foreground transition-colors">
          Shop
        </Link>
        <ChevronRight className="h-4 w-4" />
        <span className="text-foreground font-medium truncate">{product.name}</span>
      </nav>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Product Images - Left */}
        <div className="lg:col-span-1">
          <ProductImages images={product.images!} />
        </div>

        {/* Product Info - Middle */}
        <div className="lg:col-span-1 space-y-6">
          {/* Brand and Category */}
          <div className="flex items-center gap-2 text-sm">
            <span className="text-muted-foreground uppercase tracking-wide">{product.brand}</span>
            <span className="text-muted-foreground">•</span>
            <span className="text-muted-foreground capitalize">{product.category}</span>
          </div>

          {/* Product Name */}
          <h1 className="h2-bold">{product.name}</h1>

          {/* Rating */}
          <div className="flex items-center gap-3">
            <div className="flex items-center">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={cn(
                    "h-5 w-5",
                    i < Math.floor(rating)
                      ? "fill-yellow-400 text-yellow-400"
                      : "fill-gray-200 text-gray-200"
                  )}
                />
              ))}
            </div>
            <span className="text-sm text-muted-foreground">
              {rating} ({product.numReviews || 0} reviews)
            </span>
          </div>

          {/* Price */}
          <div className="flex items-baseline gap-2">
            <ProductPrice value={Number(product.price)} claseName="text-3xl font-bold" />
          </div>

          {/* Features */}
          {product.stock! > 0 ? (
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm text-green-600">
                <Package className="h-4 w-4" />
                <span className="font-medium">In Stock</span>
                {product.stock! < 10 && (
                  <span className="text-muted-foreground">
                    - Only {product.stock} left!
                  </span>
                )}
              </div>
              {product.isFeatured && (
                <Badge className="bg-accent text-accent-foreground">
                  Featured Product
                </Badge>
              )}
            </div>
          ) : (
            <div className="flex items-center gap-2 text-sm text-destructive">
              <Package className="h-4 w-4" />
              <span className="font-medium">Out of Stock</span>
            </div>
          )}

          {/* Description */}
          <div className="border-t pt-6 space-y-3">
            <h2 className="font-semibold text-lg">Description</h2>
            <p className="text-muted-foreground leading-relaxed">
              {product.description}
            </p>
          </div>

          {/* Trust Signals */}
          <Card className="bg-muted/30">
            <CardContent className="p-4 space-y-2">
              <div className="flex items-start gap-3">
                <Truck className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-medium text-sm">Free Shipping</p>
                  <p className="text-xs text-muted-foreground">On orders over $100</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Buy Card - Right Sticky */}
        <div className="lg:col-span-1">
          <div className="sticky top-20">
            <Card>
              <CardContent className="p-6 space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center justify-between pb-3 border-b">
                    <span className="text-sm text-muted-foreground">Price</span>
                    <ProductPrice value={Number(product.price)} claseName="text-2xl font-bold" />
                  </div>
                  
                  <div className="flex items-center justify-between pb-3 border-b">
                    <span className="text-sm text-muted-foreground">Status</span>
                    {product.stock! > 0 ? (
                      <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                        In Stock
                      </Badge>
                    ) : (
                      <Badge variant="destructive">Unavailable</Badge>
                    )}
                  </div>
                </div>

                {product.stock! > 0 && (
                  <div className="pt-2" data-buy-button>
                    <AddToCartWrapper
                      item={{
                        productId: product.id,
                        name: product.name,
                        slug: product.slug,
                        price: +product.price,
                        qty: 1,
                        image: product.images![0],
                      }}
                    />
                  </div>
                )}
                
                {product.stock! === 0 && (
                  <p className="text-sm text-center text-muted-foreground pt-2">
                    This product is currently unavailable
                  </p>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Reviews */}
      <div className="mt-12 border-t pt-10">
        <ReviewSection
          productId={product.id}
          productSlug={product.slug}
          avgRating={rating}
          numReviews={product.numReviews || 0}
        />
      </div>
    </div>
  );
};

export default ProductDetailsPage;
