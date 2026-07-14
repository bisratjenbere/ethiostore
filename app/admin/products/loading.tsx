import { Skeleton } from "@/components/ui/skeleton";
import { Card } from "@/components/ui/card";

export default function ProductsLoading() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <Skeleton className="h-9 w-56" />
          <Skeleton className="mt-2 h-4 w-72" />
        </div>
        <Skeleton className="h-10 w-36" />
      </div>

      <div className="space-y-4">
        {/* Search */}
        <Skeleton className="h-10 w-full" />

        {/* Table */}
        <Card className="p-6">
          <div className="space-y-3">
            {[1, 2, 3, 4, 5].map((i) => (
              <Skeleton key={i} className="h-20 w-full" />
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}
