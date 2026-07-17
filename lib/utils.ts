import { PrismaClientKnownRequestError } from "@prisma/client/runtime/client";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { ZodError } from "zod";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function convertToPlainObject<T>(value: T): T {
  return JSON.parse(JSON.stringify(value));
}
export function formatNumberWithDecimal(num: number): string {
  const [int, decimal] = num.toFixed(2).split(".");
  return decimal ? `${int}.${decimal.padEnd(2, "0")}` : `${int}.00}`;
}

export const round2 = (value: string | number) => {
  if (typeof value == "string") {
    return Math.round((Number(value) + Number.EPSILON) * 100) / 100;
  } else if (typeof value == "number") {
    return Math.round((value + Number.EPSILON) * 100) / 100;
  } else {
    throw new Error("value is not string or number");
  }
};

//eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function formatError(error: any): Promise<string> {
  console.error("Internal error:", error);
  if (error instanceof ZodError) {
    return error.issues.map((err) => err.message).join(". ");
  }
  if (error instanceof PrismaClientKnownRequestError) {
    const field = (error.meta?.target as string) ?? "Field";
    return `${field.charAt(0).toUpperCase() + field.slice(1)} already exists`;
  }
  if (typeof error.message === "string") {
    return error.message;
  }
  return "An unexpected error occurred. Please try again.";
}
//eslint-disable-next-line @typescript-eslint/no-explicit-any
export function getNormalizedName(user: any) {
  if (user.name === "NO_NAME") {
    return user?.email.split("@")[0] ?? null;
  }
  return user.name;
}

const CURRENCY_FORMATTER = new Intl.NumberFormat("en-ET", {
  currency: "ETB",
  style: "currency",
  minimumFractionDigits: 2,
});

export function FormatCurrency(amount: number | string | null) {
  if (typeof amount === "number") {
    return CURRENCY_FORMATTER.format(amount).replace('ETB', 'Birr');
  } else if (typeof amount === "string") {
    return CURRENCY_FORMATTER.format(Number(amount)).replace('ETB', 'Birr');
  } else {
    return "NaN";
  }
}
