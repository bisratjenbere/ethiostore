import { Product } from "@/types";
import ProductPrice from "./product-price";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

import Image from "next/image";
import Link from "next/link";

const ProductCard = ({ product }: { product: Product }) => {
  return (
    <Card className="w-full max-w-sm ">
      <CardHeader className="items-center p-4">
        <Link href={`product/${product.slug}`}>
          <Image
            priority={true}
            src={product.images![0]}
            alt={product.name}
            height={300}
            width={300}
            className="rounded aspect-square object-cover"
          />
        </Link>
      </CardHeader>
      <CardContent className="grid p-4  gap-4">
        <div className="text-xs">{product.brand}</div>
        <Link href={`/product/${product.slug}`}>
          <h2 className="font-medium text-sm">{product.name}</h2>
        </Link>
        <div className="flex-between gap-4">
          <p>{product.rating} stars</p>
          {product.stock! > 0 ? (
            <ProductPrice value={Number(product.price)} />
          ) : (
            <p className="text-destructive"> Out of Stock</p>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default ProductCard;
