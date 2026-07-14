import { auth } from "@/auth";
import { Star } from "lucide-react";
import Link from "next/link";
import {
  getProductReviews,
  getUserReviewForProduct,
  getProductRatingBreakdown,
} from "@/lib/actions/review.actions";
import ReviewList from "./review-list";
import ReviewForm from "./review-form";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export default async function ReviewSection({
  productId,
  productSlug,
  avgRating,
  numReviews,
}: {
  productId: string;
  productSlug: string;
  avgRating: number;
  numReviews: number;
}) {
  const session = await auth();
  const isLoggedIn = !!session?.user?.id;

  const [{ reviews, totalPages }, existingReview, breakdown] =
    await Promise.all([
      getProductReviews(productId),
      isLoggedIn ? getUserReviewForProduct(productId) : Promise.resolve(null),
      getProductRatingBreakdown(productId),
    ]);

  return (
    <div className="space-y-8">
      <h2 className="text-2xl font-bold">Customer Reviews</h2>

      {/* Rating Summary */}
      <div className="grid sm:grid-cols-2 gap-6">
        {/* Overall score */}
        <Card>
          <CardContent className="p-6 flex flex-col items-center justify-center gap-2">
            <span className="text-6xl font-bold">{avgRating.toFixed(1)}</span>
            <div className="flex items-center gap-0.5">
              {[1, 2, 3, 4, 5].map((i) => (
                <Star
                  key={i}
                  className={cn(
                    "h-5 w-5",
                    i <= Math.round(avgRating)
                      ? "fill-yellow-400 text-yellow-400"
                      : "fill-gray-200 text-gray-200"
                  )}
                />
              ))}
            </div>
            <p className="text-sm text-muted-foreground">
              {numReviews} {numReviews === 1 ? "review" : "reviews"}
            </p>
          </CardContent>
        </Card>

        {/* Breakdown bars */}
        <Card>
          <CardContent className="p-6 space-y-2">
            {[5, 4, 3, 2, 1].map((star) => (
              <div key={star} className="flex items-center gap-3 text-sm">
                <span className="w-4 text-right text-muted-foreground">{star}</span>
                <Star className="h-3.5 w-3.5 fill-yellow-400 text-yellow-400 flex-shrink-0" />
                <div className="flex-1 bg-muted rounded-full h-2 overflow-hidden">
                  <div
                    className="h-full bg-yellow-400 rounded-full transition-all"
                    style={{ width: `${breakdown[star]?.percent ?? 0}%` }}
                  />
                </div>
                <span className="w-8 text-right text-muted-foreground">
                  {breakdown[star]?.percent ?? 0}%
                </span>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Review Form or Sign-in prompt */}
      {isLoggedIn ? (
        <ReviewForm productId={productId} existingReview={existingReview} />
      ) : (
        <Card>
          <CardContent className="p-6 text-center space-y-3">
            <p className="text-sm text-muted-foreground">
              Sign in to leave a review
            </p>
            <Button asChild variant="outline">
              <Link href={`/sign-in?callbackUrl=/product/${productSlug}`}>
                Sign In
              </Link>
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Reviews List */}
      <div className="space-y-4">
        <h3 className="font-semibold text-lg">
          {numReviews > 0 ? `All Reviews (${numReviews})` : "Reviews"}
        </h3>
        <ReviewList reviews={reviews} />
        {totalPages > 1 && (
          <p className="text-sm text-muted-foreground text-center pt-2">
            Showing first 5 reviews
          </p>
        )}
      </div>
    </div>
  );
}
