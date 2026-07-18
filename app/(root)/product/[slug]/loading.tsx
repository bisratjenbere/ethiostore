import { Skeleton } from "@/components/ui/skeleton";

export default function ProductDetailLoading() {
  return (
    <div className="wrapper py-8">
      <div className="grid md:grid-cols-2 gap-8">
        {/* Image gallery skeleton */}
        <div className="space-y-4">
          <Skeleton className="aspect-square w-full rounded-lg" />
          <div className="grid grid-cols-4 gap-2">
            {Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} className="aspect-square w-full rounded-md" />
            ))}
          </div>
        </div>

        {/* Product details skeleton */}
        <div className="space-y-6">
          {/* Brand */}
          <Skeleton className="h-5 w-24" />
          
          {/* Title */}
          <Skeleton className="h-8 w-full" />
          
          {/* Rating */}
          <div className="flex items-center gap-2">
            <Skeleton className="h-5 w-32" />
            <Skeleton className="h-5 w-20" />
          </div>
          
          {/* Price */}
          <Skeleton className="h-10 w-32" />
          
          {/* Description */}
          <div className="space-y-2">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-3/4" />
          </div>
          
          {/* Stock status */}
          <Skeleton className="h-6 w-24" />
          
          {/* Quantity selector and add to cart */}
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <Skeleton className="h-11 w-11" />
              <Skeleton className="h-11 w-16" />
              <Skeleton className="h-11 w-11" />
            </div>
            <Skeleton className="h-11 w-full" />
          </div>
        </div>
      </div>

      {/* Reviews section skeleton */}
      <div className="mt-12 space-y-6">
        <Skeleton className="h-8 w-48" />
        <div className="space-y-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="space-y-2 p-4 border rounded-lg">
              <Skeleton className="h-5 w-32" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-3/4" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
