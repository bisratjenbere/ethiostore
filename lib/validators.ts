import { z } from "zod";
import { formatNumberWithDecimal } from "./utils";
import { PAYMENT_METHODS } from "./constants";

const currency = z
  .string()
  .refine(
    (val) => /^\d+(\.\d{2})?$/.test(formatNumberWithDecimal(Number(val))),
    "Price must have exactly two decimal places"
  );
//Schema For Inserting Product

export const insertProductSchema = z.object({
  name: z.string().min(3, "Product name must be at least 3 characters long"),
  slug: z.string().min(3, "Product slug must be at least 3 characters long"),
  brand: z.string().min(3, "Brand must be at least 3 characters long"),
  category: z.string().min(3, "Category must be at least 3 characters long"),
  description: z
    .string()
    .min(3, "Description must be at least 10 characters long"),
  stock: z.coerce.number(),
  images: z
    .array(z.string().trim().min(1, "Image URL cannot be empty"))
    .min(1, "At least one image is required")
    .refine(
      (images) => images.every((img) => img.startsWith('/') || img.startsWith('http')),
      "All images must be valid URLs (starting with / or http)"
    ),
  isFeatured: z.boolean(),
  banner: z.string().optional().nullable(),
  price: currency,
});

export const signInFromSchema = z.object({
  email: z
    .string()
    .email("Invalid email address")
    .min(3, "Email must be at least 3 characters long"),
  password: z.string().min(8, "Password must be at least 8 characters long"),
});

export const signUpFormSchema = z
  .object({
    name: z.string().min(3, "Name Must be at least 3 character"),
    email: z.string().min(3, "password must be at least 3 character"),
    password: z.string()
      .min(8, "Password must be at least 8 characters")
      .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
      .regex(/[a-z]/, "Password must contain at least one lowercase letter")
      .regex(/[0-9]/, "Password must contain at least one number")
      .regex(/[^A-Za-z0-9]/, "Password must contain at least one special character"),
    confirmPassword: z
      .string()
      .min(3, "Confirm Password must be at least 3 characters"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "passwords don't match",
    path: ["confirmPassword"],
  });

export const cartItemSchema = z.object({
  productId: z.string().min(1, "Product is required"),
  name: z.string().min(1, "Name is required"),
  slug: z.string().min(1, "Slug is required"),
  qty: z.number().int().nonnegative("Quantity must be a non-negative number"),
  image: z.string().min(1, "Image is required"),
  price: z
    .number()
    .refine(
      (value) => /^\d+(\.\d{2})?$/.test(Number(value).toFixed(2)),
      "Price must have exactly two decimal places"
    ),
});

export const insertCartSchema = z.object({
  items: z.array(cartItemSchema),
  itemsPrice: currency,
  totalPrice: currency,
  shippingPrice: currency,
  taxPrice: currency,
  sessionCartId: z.string().min(1, "Session cart id is required"),
  userId: z.string().nullable().optional(),
});

export const shippingAddressSchema = z.object({
  fullName: z.string().min(3, "Name must be at least 3 characters"),
  streetAddress: z.string().min(3, "Address must be at least 3 characters"),
  city: z.string().min(3, "city must be at least 3 character"),
  country: z.string().min(3, "Count should be at least 3 character"),
  postalCode: z.string().min(3, "Postal code must be at least 3 characters"),
  lat: z.number().optional(),
  lng: z.number().optional(),
});

export const paymentMethodSchema = z
  .object({
    type: z.string().min(1, "Payment method is required"),
  })
  .refine((data) => PAYMENT_METHODS.includes(data.type), {
    path: ["path"],
    message: "Invalid payment method",
  });
export const insertOrderSchema = z.object({
  userId: z.string().min(1, "Useris Required"),
  itemsPrice: currency,
  shippingPrice: currency,
  taxPrice: currency,
  totalPrice: currency,
  paymentMethod: z
    .string()
    .refine((val) => PAYMENT_METHODS.includes(val), "Invalid payment method"),
  shippingAddress: shippingAddressSchema,
});
export const insertOrderItemSchema = z.object({
  productId: z.string(),
  slug: z.string(),
  image: z.string(),
  name: z.string(),
  qty: z.number(),
  price: currency,
});

export const insertReviewSchema = z.object({
  productId: z.string().min(1, "Product is required"),
  rating: z.number().int().min(1, "Rating required").max(5),
  title: z.string().min(3, "Title must be at least 3 characters"),
  comment: z.string().min(10, "Review must be at least 10 characters"),
});
