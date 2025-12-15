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
export async function formatError(error: any) {
  if (error instanceof ZodError) {
    const fieldErrors = error.issues.map((err) => err.message);
    return fieldErrors.join(". ");
  } else if (error instanceof PrismaClientKnownRequestError) {
    const field = (error.meta?.target as string) ?? "Field";

    return `${field.charAt(0).toUpperCase() + field.slice(1)} already exists`;
  } else {
    return typeof error.message === "string"
      ? error.message
      : JSON.stringify(error.message);
  }
}
