import { Product } from "@/types";
import ProductCard from "./product-card";

const ProductList = ({
  title,
  data,
  limit,
}: {
  data: Product[];
  title?: string;
  limit?: number;
}) => {
  const limitedData = limit ? data.slice(0, limit) : data;
  
  return (
    <div className="space-y-8">
      {title && <h2 className="h2-bold">{title}</h2>}
      {data.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
          {limitedData.map((product: Product) => (
            <ProductCard key={product?.slug} product={product} />
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <p className="text-muted-foreground">No products found</p>
        </div>
      )}
    </div>
  );
};

export default ProductList;
