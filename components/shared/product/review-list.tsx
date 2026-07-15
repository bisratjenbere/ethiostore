"use client";

import { useState, useTransition } from "react";
import { Star, Trash2, Edit, BadgeCheck } from "lucide-react";
import { toast } from "sonner";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Review } from "@/types";
import { deleteReview } from "@/lib/actions/review.actions";
import { cn } from "@/lib/utils";

interface ReviewListProps {
  reviews: Review[];
  currentUserId?: string;
  isAdmin?: boolean;
  onEdit?: (review: Review) => void;
  onDelete?: () => void;
}

const ReviewList = ({
  reviews,
  currentUserId,
  isAdmin,
  onEdit,
  onDelete,
}: ReviewListProps) => {
  const [isPending, startTransition] = useTransition();
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [reviewToDelete, setReviewToDelete] = useState<string | null>(null);

  const handleDelete = (reviewId: string) => {
    setReviewToDelete(reviewId);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    if (!reviewToDelete) return;

    startTransition(async () => {
      const res = await deleteReview(reviewToDelete);
      if (!res.success) {
        toast.error(res.message);
        return;
      }
      toast.success(res.message);
      setDeleteDialogOpen(false);
      setReviewToDelete(null);
      if (onDelete) onDelete();
    });
  };

  if (reviews.length === 0) {
    return (
      <Card>
        <CardContent className="p-8 text-center">
          <p className="text-muted-foreground">
            No reviews yet. Be the first to review this product!
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <div className="space-y-4">
        {reviews.map((review) => {
          const isOwner = currentUserId === review.userId;
          const canModify = isOwner || isAdmin;

          return (
            <Card key={review.id}>
              <CardContent className="p-6">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 space-y-3">
                    {/* User Info and Rating */}
                    <div className="flex items-center gap-3 flex-wrap">
                      <span className="font-semibold">{review.user.name}</span>
                      {review.isVerified && (
                        <Badge
                          variant="outline"
                          className="bg-green-50 text-green-700 border-green-200 flex items-center gap-1"
                        >
                          <BadgeCheck className="h-3 w-3" />
                          Verified Purchase
                        </Badge>
                      )}
                      <span className="text-sm text-muted-foreground">
                        {new Date(review.createdAt).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })}
                      </span>
                    </div>

                    {/* Star Rating */}
                    <div className="flex items-center gap-2">
                      <div className="flex items-center">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={cn(
                              "h-4 w-4",
                              i < review.rating
                                ? "fill-yellow-400 text-yellow-400"
                                : "fill-gray-200 text-gray-200"
                            )}
                          />
                        ))}
                      </div>
                    </div>

                    {/* Review Title */}
                    <h4 className="font-semibold text-lg">{review.title}</h4>

                    {/* Review Comment */}
                    <p className="text-muted-foreground leading-relaxed">
                      {review.comment}
                    </p>
                  </div>

                  {/* Action Buttons */}
                  {canModify && (
                    <div className="flex gap-2">
                      {isOwner && onEdit && (
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => onEdit(review)}
                          disabled={isPending}
                          title="Edit review"
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                      )}
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDelete(review.id)}
                        disabled={isPending}
                        title="Delete review"
                        className="text-destructive hover:text-destructive"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Review</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this review? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isPending}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDelete}
              disabled={isPending}
              className="bg-destructive hover:bg-destructive/90"
            >
              {isPending ? "Deleting..." : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default ReviewList;
