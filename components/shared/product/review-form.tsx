"use client";

import { useTransition, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Star, Loader } from "lucide-react";
import { toast } from "sonner";
import { insertReviewSchema } from "@/lib/validators";
import { createOrUpdateReview, deleteReview } from "@/lib/actions/review.actions";
import { Review } from "@/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

type FormValues = z.infer<typeof insertReviewSchema>;

export default function ReviewForm({
  productId,
  existingReview,
}: {
  productId: string;
  existingReview: Review | null;
}) {
  const [isPending, startTransition] = useTransition();
  const [isDeleting, startDeleteTransition] = useTransition();
  const [hoveredStar, setHoveredStar] = useState(0);

  const form = useForm<FormValues>({
    resolver: zodResolver(insertReviewSchema),
    defaultValues: {
      productId,
      rating: existingReview?.rating ?? 0,
      title: existingReview?.title ?? "",
      comment: existingReview?.comment ?? "",
    },
  });

  const currentRating = form.watch("rating");

  function onSubmit(values: FormValues) {
    startTransition(async () => {
      const res = await createOrUpdateReview(values);
      if (res.success) {
        toast.success(res.message);
        if (!existingReview) form.reset({ productId, rating: 0, title: "", comment: "" });
      } else {
        toast.error(res.message);
      }
    });
  }

  function handleDelete() {
    if (!existingReview) return;
    startDeleteTransition(async () => {
      const res = await deleteReview(existingReview.id);
      if (res.success) toast.success(res.message);
      else toast.error(res.message);
    });
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">
          {existingReview ? "Edit Your Review" : "Write a Review"}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="rating"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Rating</FormLabel>
                  <FormControl>
                    <div className="flex gap-1">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          type="button"
                          onClick={() => field.onChange(star)}
                          onMouseEnter={() => setHoveredStar(star)}
                          onMouseLeave={() => setHoveredStar(0)}
                          className="focus:outline-none"
                        >
                          <Star
                            className={cn(
                              "h-7 w-7 transition-colors",
                              star <= (hoveredStar || currentRating)
                                ? "fill-yellow-400 text-yellow-400"
                                : "fill-gray-200 text-gray-200"
                            )}
                          />
                        </button>
                      ))}
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Title</FormLabel>
                  <FormControl>
                    <Input placeholder="Summarize your experience" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="comment"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Review</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Share your thoughts about this product..."
                      rows={4}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex gap-3">
              <Button type="submit" disabled={isPending} className="flex-1">
                {isPending && <Loader className="h-4 w-4 animate-spin mr-2" />}
                {existingReview ? "Update Review" : "Submit Review"}
              </Button>
              {existingReview && (
                <Button
                  type="button"
                  variant="destructive"
                  onClick={handleDelete}
                  disabled={isDeleting}
                >
                  {isDeleting ? <Loader className="h-4 w-4 animate-spin" /> : "Delete"}
                </Button>
              )}
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
