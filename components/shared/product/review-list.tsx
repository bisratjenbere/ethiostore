import { Star, ShieldCheck } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { Review } from "@/types";

function StarRow({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((i) => (
        <Star
          key={i}
          className={cn(
            "h-4 w-4",
            i <= rating ? "fill-yellow-400 text-yellow-400" : "fill-gray-200 text-gray-200"
          )}
        />
      ))}
    </div>
  );
}

export default function ReviewList({ reviews }: { reviews: Review[] }) {
  if (reviews.length === 0) {
    return (
      <p className="text-sm text-muted-foreground py-6 text-center">
        No reviews yet. Be the first to review this product!
      </p>
    );
  }

  return (
    <div className="space-y-6">
      {reviews.map((review) => (
        <div key={review.id} className="border-b pb-6 last:border-0 last:pb-0">
          <div className="flex items-start justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <StarRow rating={review.rating} />
                {review.isVerified && (
                  <Badge variant="outline" className="text-xs text-green-700 border-green-200 bg-green-50 gap-1">
                    <ShieldCheck className="h-3 w-3" />
                    Verified Purchase
                  </Badge>
                )}
              </div>
              <p className="font-semibold text-sm">{review.title}</p>
            </div>
            <span className="text-xs text-muted-foreground whitespace-nowrap">
              {new Date(review.createdAt).toLocaleDateString(undefined, {
                year: "numeric",
                month: "short",
                day: "numeric",
              })}
            </span>
          </div>
          <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
            {review.comment}
          </p>
          <p className="mt-2 text-xs text-muted-foreground">
            — {review.user.name.split(" ")[0]}
          </p>
        </div>
      ))}
    </div>
  );
}
