"use client";

import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Star } from "lucide-react";
import { toast } from "sonner";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { insertReviewSchema } from "@/lib/validators";
import { createOrUpdateReview } from "@/lib/actions/review.actions";
import { cn } from "@/lib/utils";

interface ReviewFormProps {
  productId: string;
  existingReview?: {
    rating: number;
    title: string;
    comment: string;
  };
  onSuccess?: () => void;
}

type ReviewFormData = {
  productId: string;
  rating: number;
  title: string;
  comment: string;
};

const ReviewForm = ({ productId, existingReview, onSuccess }: ReviewFormProps) => {
  const [isPending, startTransition] = useTransition();
  const [hoveredStar, setHoveredStar] = useState(0);

  const form = useForm<ReviewFormData>({
    resolver: zodResolver(insertReviewSchema),
    defaultValues: {
      productId,
      rating: existingReview?.rating || 0,
      title: existingReview?.title || "",
      comment: existingReview?.comment || "",
    },
  });

  const rating = form.watch("rating");

  const onSubmit = (values: ReviewFormData) => {
    startTransition(async () => {
      const res = await createOrUpdateReview(values);
      if (!res.success) {
        toast.error(res.message);
        return;
      }
      toast.success(res.message);
      form.reset();
      if (onSuccess) onSuccess();
    });
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        {/* Star Rating Selector */}
        <FormField
          control={form.control}
          name="rating"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-base font-semibold">
                Rating <span className="text-destructive">*</span>
              </FormLabel>
              <FormControl>
                <div className="flex items-center gap-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => field.onChange(star)}
                      onMouseEnter={() => setHoveredStar(star)}
                      onMouseLeave={() => setHoveredStar(0)}
                      className="transition-transform hover:scale-110"
                    >
                      <Star
                        className={cn(
                          "h-8 w-8 transition-colors",
                          star <= (hoveredStar || rating)
                            ? "fill-yellow-400 text-yellow-400"
                            : "fill-gray-200 text-gray-200"
                        )}
                      />
                    </button>
                  ))}
                  {rating > 0 && (
                    <span className="ml-2 text-sm text-muted-foreground">
                      {rating} star{rating !== 1 ? "s" : ""}
                    </span>
                  )}
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Review Title */}
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-base font-semibold">
                Review Title <span className="text-destructive">*</span>
              </FormLabel>
              <FormControl>
                <Input
                  {...field}
                  placeholder="Sum up your experience in one line"
                  disabled={isPending}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Review Comment */}
        <FormField
          control={form.control}
          name="comment"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-base font-semibold">
                Review <span className="text-destructive">*</span>
              </FormLabel>
              <FormControl>
                <Textarea
                  {...field}
                  placeholder="Share your thoughts about this product..."
                  rows={5}
                  disabled={isPending}
                  className="resize-none"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Submit Button */}
        <div className="flex gap-3">
          <Button type="submit" disabled={isPending} className="flex-1">
            {isPending ? "Submitting..." : existingReview ? "Update Review" : "Submit Review"}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default ReviewForm;
