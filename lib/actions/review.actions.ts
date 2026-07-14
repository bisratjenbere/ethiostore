"use server";

import { auth } from "@/auth";
import { prisma } from "@/db/prisma";
import { insertReviewSchema } from "@/lib/validators";
import { formatError, convertToPlainObject } from "@/lib/utils";
import { revalidatePath } from "next/cache";
import { z } from "zod";

const REVIEWS_PER_PAGE = 5;

async function updateProductRating(productId: string) {
  const { _avg, _count } = await prisma.review.aggregate({
    where: { productId },
    _avg: { rating: true },
    _count: { rating: true },
  });
  await prisma.product.update({
    where: { id: productId },
    data: {
      rating: _avg.rating ?? 0,
      numReviews: _count.rating,
    },
  });
}

export async function createOrUpdateReview(
  data: z.infer<typeof insertReviewSchema>
) {
  try {
    const session = await auth();
    if (!session?.user?.id) throw new Error("Sign in to leave a review");

    const validated = insertReviewSchema.parse(data);

    const hasPurchased = await prisma.orderItem.findFirst({
      where: {
        productId: validated.productId,
        order: { userId: session.user.id, isPaid: true },
      },
    });

    await prisma.review.upsert({
      where: {
        userId_productId: {
          userId: session.user.id,
          productId: validated.productId,
        },
      },
      update: {
        rating: validated.rating,
        title: validated.title,
        comment: validated.comment,
        isVerified: !!hasPurchased,
      },
      create: {
        userId: session.user.id,
        productId: validated.productId,
        rating: validated.rating,
        title: validated.title,
        comment: validated.comment,
        isVerified: !!hasPurchased,
      },
    });

    await updateProductRating(validated.productId);

    const product = await prisma.product.findUnique({
      where: { id: validated.productId },
      select: { slug: true },
    });
    if (product) revalidatePath(`/product/${product.slug}`);

    return { success: true, message: "Review submitted successfully" };
  } catch (error) {
    return { success: false, message: await formatError(error) };
  }
}

export async function deleteReview(reviewId: string) {
  try {
    const session = await auth();
    if (!session?.user?.id) throw new Error("Unauthorized");

    const review = await prisma.review.findUnique({ where: { id: reviewId } });
    if (!review) throw new Error("Review not found");
    if (review.userId !== session.user.id && session.user.role !== "admin") {
      throw new Error("Unauthorized");
    }

    await prisma.review.delete({ where: { id: reviewId } });
    await updateProductRating(review.productId);

    const product = await prisma.product.findUnique({
      where: { id: review.productId },
      select: { slug: true },
    });
    if (product) revalidatePath(`/product/${product.slug}`);

    return { success: true, message: "Review deleted" };
  } catch (error) {
    return { success: false, message: await formatError(error) };
  }
}

export async function getProductReviews(productId: string, page = 1) {
  const [reviews, total] = await Promise.all([
    prisma.review.findMany({
      where: { productId },
      include: { user: { select: { name: true } } },
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * REVIEWS_PER_PAGE,
      take: REVIEWS_PER_PAGE,
    }),
    prisma.review.count({ where: { productId } }),
  ]);

  return convertToPlainObject({
    reviews,
    totalPages: Math.ceil(total / REVIEWS_PER_PAGE),
    total,
  });
}

export async function getUserReviewForProduct(productId: string) {
  const session = await auth();
  if (!session?.user?.id) return null;

  const review = await prisma.review.findUnique({
    where: {
      userId_productId: { userId: session.user.id, productId },
    },
    include: { user: { select: { name: true } } },
  });
  return review ? convertToPlainObject(review) : null;
}

export async function getProductRatingBreakdown(productId: string) {
  const breakdown = await prisma.review.groupBy({
    by: ["rating"],
    where: { productId },
    _count: { rating: true },
  });

  const total = breakdown.reduce((sum, r) => sum + r._count.rating, 0);
  const result: Record<number, { count: number; percent: number }> = {};

  for (let i = 1; i <= 5; i++) {
    const found = breakdown.find((r) => r.rating === i);
    const count = found?._count.rating ?? 0;
    result[i] = {
      count,
      percent: total > 0 ? Math.round((count / total) * 100) : 0,
    };
  }

  return result;
}
