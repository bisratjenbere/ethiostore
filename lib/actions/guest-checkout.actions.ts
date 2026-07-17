"use server";

import { cookies } from "next/headers";
import { ShippingAddress } from "@/types";

const COOKIE = "guestCheckout";
const MAX_AGE = 60 * 60 * 2; // 2 hours

export type GuestCheckoutData = {
  email?: string;
  address?: ShippingAddress;
  paymentMethod?: string;
};

export async function saveGuestCheckoutData(data: Partial<GuestCheckoutData>) {
  const cookieStore = await cookies();
  const existing = await getGuestCheckoutData();
  const merged = { ...existing, ...data };
  cookieStore.set(COOKIE, JSON.stringify(merged), {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: MAX_AGE,
    path: "/",
  });
}

export async function getGuestCheckoutData(): Promise<GuestCheckoutData | null> {
  const cookieStore = await cookies();
  const raw = cookieStore.get(COOKIE)?.value;
  if (!raw) return null;
  try {
    return JSON.parse(raw) as GuestCheckoutData;
  } catch {
    return null;
  }
}

export async function clearGuestCheckoutData() {
  const cookieStore = await cookies();
  cookieStore.delete(COOKIE);
}
