import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

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
