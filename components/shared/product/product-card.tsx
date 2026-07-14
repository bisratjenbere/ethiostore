import { Product } from "@/types";
import ProductPrice from "./product-price";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Star } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";

const ProductCard = ({ product }: { product: Product }) => {
  return (
    <Card className="group h-full overflow-hidden hover:shadow-2xl transition-all duration-300 border-0 shadow-md">
      {/* Image with Badges */}
      <CardHeader className="p-0 relative overflow-hidden">
        {/* Badges - positioned on top of image */}
        <div className="absolute top-3 left-0 right-0 z-10 flex items-start justify-between px-3 gap-2">
          {product.isFeatured && (
            <Badge className="bg-accent text-accent-foreground hover:bg-accent/90 text-xs whitespace-nowrap shadow-lg">
              Featured
            </Badge>
          )}
          
          {product.stock! > 0 && product.stock! < 10 && (
            <Badge variant="destructive" className="text-xs whitespace-nowrap ml-auto shadow-lg">
              Only {product.stock} left!
            </Badge>
          )}
        </div>
        
        {/* Image */}
        <Link href={`/product/${product.slug}`}>
          <div className="relative aspect-square bg-muted/30">
            <Image
              src={product.images![0]}
              alt={product.name}
              fill
              className="object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
            />
          </div>
        </Link>
      </CardHeader>
      
      {/* Content */}
      <CardContent className="p-4 md:p-6 space-y-2 md:space-y-3">
        {/* Brand */}
        <p className="text-xs uppercase tracking-wider text-muted-foreground font-medium">
          {product.brand}
        </p>
        
        {/* Product Name */}
        <Link href={`/product/${product.slug}`}>
          <h3 className="font-semibold text-sm md:text-base line-clamp-2 leading-tight group-hover:text-primary transition-colors min-h-[2.5rem]">
            {product.name}
          </h3>
        </Link>
        
        {/* Rating */}
        <div className="flex items-center gap-2">
          <div className="flex items-center">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={cn(
                  "h-3 w-3 md:h-3.5 md:w-3.5",
                  i < Math.floor(Number(product.rating))
                    ? "fill-yellow-400 text-yellow-400"
                    : "fill-gray-200 text-gray-200"
                )}
              />
            ))}
          </div>
          <span className="text-xs text-muted-foreground">
            ({product.rating})
          </span>
        </div>
        
        {/* Price & Stock */}
        <div className="flex items-center justify-between pt-2 border-t">
          {product.stock! > 0 ? (
            <ProductPrice
              value={Number(product.price)}
              claseName="text-lg md:text-xl font-bold"
            />
          ) : (
            <Badge variant="secondary" className="text-xs">
              Out of Stock
            </Badge>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default ProductCard;
