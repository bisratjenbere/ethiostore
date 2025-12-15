import { Description } from "@radix-ui/react-dialog";
import { email, z } from "zod";
import { formatNumberWithDecimal } from "./utils";

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
