"use client";

import { Star } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface ReviewSectionProps {
  productId: string;
  productSlug: string;
  avgRating: number;
  numReviews: number;
}

const ReviewSection = ({
  productId,
  productSlug,
  avgRating,
  numReviews,
}: ReviewSectionProps) => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Customer Reviews</h2>
          <div className="flex items-center gap-2 mt-2">
            <div className="flex items-center">
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
            <span className="text-sm text-muted-foreground">
              {avgRating} out of 5 ({numReviews} {numReviews === 1 ? 'review' : 'reviews'})
            </span>
          </div>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Reviews Coming Soon</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            The review feature is currently under development. Check back soon to see what customers are saying about this product!
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default ReviewSection;
