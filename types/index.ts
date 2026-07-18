import { z } from "zod";
import {
  insertProductSchema,
  insertCartSchema,
  cartItemSchema,
  shippingAddressSchema,
  insertOrderItemSchema,
  insertOrderSchema,
  insertReviewSchema,
} from "@/lib/validators";

export type Product = z.infer<typeof insertProductSchema> & {
  id: string;
  rating: string;
  numReviews: number;
  createdAt: Date;
};

// Lighter type for product listings (omits description, rating, numReviews, banner, createdAt, updatedAt)
// Used in shop/search to reduce response size by 5x (50KB → 10KB for 12 products)
// Bug #1 Fix: Return ONLY 9 fields required for product list views
export type ProductListItem = {
  id: string;
  name: string;
  slug: string;
  price: string;
  images: string[];
  stock: number;
  brand: string;
  category: string;
  isFeatured: boolean;
};

export type Cart = z.infer<typeof insertCartSchema>;
export type cartItem = z.infer<typeof cartItemSchema>;
export type ShippingAddress = z.infer<typeof shippingAddressSchema>;
export type orderItem = z.infer<typeof insertOrderItemSchema>;
export type Order = z.infer<typeof insertOrderSchema> & {
  id: string;
  createdAt: Date;
  isPaid: boolean;
  paidAt: Date | null;
  deliveredAt: Date | null;
  isDelivered: boolean;
  orderItems: orderItem[];
  user: { name: string; email: string };
};

export type Review = z.infer<typeof insertReviewSchema> & {
  id: string;
  userId: string;
  isVerified: boolean;
  createdAt: Date;
  user: { name: string };
};
