"use server";

import { auth } from "@/auth";
import { cartItem } from "@/types";
import { cookies } from "next/headers";

export async function addItemToCart(data: cartItem) {
  try {
    const sessionCartId = (await cookies()).get("sessionCartId")?.value;
    if (!sessionCartId) throw new Error("Cart  Session not found");
    const session = await auth();
    const userId = session?.user?.id ? (session.user.id as string) : undefined;
  } catch (error) {}
  return {
    success: true,
    message: "item added to cart",
  };
}
