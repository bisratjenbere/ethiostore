"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { Edit, MessageSquare } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import ReviewForm from "./review-form";
import ReviewList from "./review-list";
import RatingBreakdown from "./rating-breakdown";
import {
  getProductReviews,
  getUserReviewForProduct,
  getProductRatingBreakdown,
} from "@/lib/actions/review.actions";
import { Review } from "@/types";

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
  const { data: session, status } = useSession();
  const [reviews, setReviews] = useState<Review[]>([]);
  const [userReview, setUserReview] = useState<Review | null>(null);
  const [breakdown, setBreakdown] = useState<Record<number, { count: number; percent: number }>>({});
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingReview, setEditingReview] = useState<Review | null>(null);
  const [loading, setLoading] = useState(true);
  
  const isAuthenticated = status === "authenticated";

  // Fetch reviews and breakdown
  const fetchReviews = async (page = 1) => {
    setLoading(true);
    try {
      const [reviewsData, breakdownData, userReviewData] = await Promise.all([
        getProductReviews(productId, page),
        getProductRatingBreakdown(productId),
        session?.user?.id ? getUserReviewForProduct(productId) : Promise.resolve(null),
      ]);

      setReviews(reviewsData.reviews);
      setTotal(reviewsData.total);
      setTotalPages(reviewsData.totalPages);
      setCurrentPage(page);
      setBreakdown(breakdownData);
      setUserReview(userReviewData);
    } catch (error) {
      console.error("Error fetching reviews:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (status !== "loading") {
      fetchReviews(1);
    }
  }, [productId, status]);

  const handleOpenDialog = (review?: Review) => {
    if (review) {
      setEditingReview(review);
    } else {
      setEditingReview(null);
    }
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    setEditingReview(null);
  };

  const handleSuccess = () => {
    handleCloseDialog();
    fetchReviews(currentPage);
  };

  const handleEdit = (review: Review) => {
    handleOpenDialog(review);
  };

  const handlePageChange = (page: number) => {
    fetchReviews(page);
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h2 className="text-3xl font-bold">Customer Reviews</h2>
          <p className="text-muted-foreground mt-1">
            {total} {total === 1 ? "review" : "reviews"} for this product
          </p>
        </div>

        {/* Write Review Button */}
        {status === "loading" ? (
          <Button disabled variant="outline">
            Loading...
          </Button>
        ) : isAuthenticated ? (
          <Button
            onClick={() => handleOpenDialog(userReview || undefined)}
            variant={userReview ? "outline" : "default"}
          >
            {userReview ? (
              <>
                <Edit className="h-4 w-4 mr-2" />
                Edit Your Review
              </>
            ) : (
              <>
                <MessageSquare className="h-4 w-4 mr-2" />
                Write a Review
              </>
            )}
          </Button>
        ) : (
          <Button asChild variant="outline">
            <Link href="/sign-in">Sign in to review</Link>
          </Button>
        )}
      </div>

      {/* Rating Breakdown */}
      {total > 0 && (
        <RatingBreakdown
          breakdown={breakdown}
          totalReviews={total}
          avgRating={avgRating}
        />
      )}

      {/* Reviews List */}
      <div>
        <h3 className="text-xl font-semibold mb-4">Reviews</h3>
        {loading ? (
          <div className="text-center py-8 text-muted-foreground">
            Loading reviews...
          </div>
        ) : (
          <ReviewList
            reviews={reviews}
            currentUserId={session?.user?.id}
            isAdmin={session?.user?.role === "admin"}
            onEdit={handleEdit}
            onDelete={() => fetchReviews(currentPage)}
          />
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center gap-2">
          <Button
            variant="outline"
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
          >
            Previous
          </Button>
          <div className="flex items-center gap-2">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <Button
                key={page}
                variant={currentPage === page ? "default" : "outline"}
                onClick={() => handlePageChange(page)}
                size="sm"
              >
                {page}
              </Button>
            ))}
          </div>
          <Button
            variant="outline"
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
          >
            Next
          </Button>
        </div>
      )}

      {/* Review Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editingReview ? "Edit Your Review" : "Write a Review"}
            </DialogTitle>
            <DialogDescription>
              Share your experience with this product to help others make informed decisions.
            </DialogDescription>
          </DialogHeader>
          <ReviewForm
            productId={productId}
            existingReview={editingReview ? {
              rating: editingReview.rating,
              title: editingReview.title,
              comment: editingReview.comment,
            } : undefined}
            onSuccess={handleSuccess}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ReviewSection;
