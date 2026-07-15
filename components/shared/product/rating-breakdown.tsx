import { Star } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

interface RatingBreakdownProps {
  breakdown: Record<number, { count: number; percent: number }>;
  totalReviews: number;
  avgRating: number;
}

const RatingBreakdown = ({
  breakdown,
  totalReviews,
  avgRating,
}: RatingBreakdownProps) => {
  return (
    <Card>
      <CardContent className="p-6">
        <div className="grid md:grid-cols-2 gap-6">
          {/* Average Rating Display */}
          <div className="flex flex-col items-center justify-center text-center space-y-2 border-r-0 md:border-r pr-6">
            <div className="text-5xl font-bold">{avgRating.toFixed(1)}</div>
            <div className="flex items-center gap-1">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`h-5 w-5 ${
                    i < Math.floor(avgRating)
                      ? "fill-yellow-400 text-yellow-400"
                      : "fill-gray-200 text-gray-200"
                  }`}
                />
              ))}
            </div>
            <p className="text-sm text-muted-foreground">
              Based on {totalReviews} {totalReviews === 1 ? "review" : "reviews"}
            </p>
          </div>

          {/* Rating Distribution */}
          <div className="space-y-3">
            {[5, 4, 3, 2, 1].map((star) => (
              <div key={star} className="flex items-center gap-3">
                <div className="flex items-center gap-1 w-16">
                  <span className="text-sm font-medium">{star}</span>
                  <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                </div>
                <Progress
                  value={breakdown[star]?.percent || 0}
                  className="flex-1 h-2"
                />
                <span className="text-sm text-muted-foreground w-12 text-right">
                  {breakdown[star]?.count || 0}
                </span>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default RatingBreakdown;
