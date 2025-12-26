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
  images: z.array(z.string().min(1, "At least one image is required")),
  isFeatured: z.boolean(),
  banner: z.string().optional().nullable(),
  price: currency,
});

export const signInFromSchema = z.object({
  email: z
    .string()
    .email("Invalid email address")
    .min(3, "Email must be at least 3 characters long"),
  password: z.string().min(3, "Password must be at least 3 characters long"),
});

export const signUpFormSchema = z
  .object({
    name: z.string().min(3, "Name Must be at least 3 character"),
    email: z.string().min(3, "password must be at least 3 character"),
    password: z.string().min(3, "password must be at least 3 character"),
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
