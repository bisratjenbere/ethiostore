import { Skeleton } from "@/components/ui/skeleton";
import { Card } from "@/components/ui/card";

export default function OrdersLoading() {
  return (
    <div className="space-y-6">
      <div>
        <Skeleton className="h-9 w-56" />
        <Skeleton className="mt-2 h-4 w-72" />
      </div>

      <div className="space-y-4">
        {/* Filters */}
        <div className="flex flex-col gap-4 sm:flex-row">
          <Skeleton className="h-10 flex-1" />
          <Skeleton className="h-10 w-full sm:w-[180px]" />
          <Skeleton className="h-10 w-full sm:w-[180px]" />
        </div>

        {/* Table */}
        <Card className="p-6">
          <div className="space-y-3">
            {[1, 2, 3, 4, 5].map((i) => (
              <Skeleton key={i} className="h-16 w-full" />
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}
