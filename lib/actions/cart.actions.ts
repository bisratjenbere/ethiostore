"use server";

import { auth } from "@/auth";
import { prisma } from "@/db/prisma";
import { cartItem } from "@/types";
import { cookies } from "next/headers";
import { convertToPlainObject, formatError, round2 } from "../utils";
import { cartItemSchema, insertCartSchema } from "../validators";
import { revalidatePath } from "next/cache";

import { Prisma } from "../generated/prisma/client";

const calcPrice = (items: cartItem[]) => {
  const itemsPrice = round2(
    items.reduce((acc, item) => acc + Number(item.price) * item.qty, 0)
  );
  const shippingPrice = round2(itemsPrice > 100 ? 0 : 10);
  const taxPrice = round2(0.15 * itemsPrice);
  const totalPrice = round2(itemsPrice + shippingPrice + taxPrice);

  return {
    itemsPrice: itemsPrice.toFixed(2),
    shippingPrice: shippingPrice.toFixed(2),
    taxPrice: taxPrice.toFixed(2),
    totalPrice: totalPrice.toFixed(),
  };
};

export async function addItemToCart(data: cartItem) {
  try {

    /// Retrive session cart id from cookies
    const sessionCartId = (await cookies()).get("sessionCartId")?.value;
    //check whater the session cart id is found 
    // The question is is there a possiblity where we can't get the session cart Id
    // if so when and how this sessionId added
    if (!sessionCartId) throw new Error("Cart  Session not found");
    /// getting current user session
    const session = await auth();
    // if there is Logged user grap the user id of curre
    const userId = session?.user?.id ? (session.user.id as string) : undefined;
    const cart = await getMyCart();
    //parse and validate
    const item = cartItemSchema.parse(data);
    //Find Product in Database
    const product = await prisma.product.findFirst({
      where: { id: item.productId },
    });
    if (!product) throw new Error("Product not found");
    if (!cart) {
      const newCart = insertCartSchema.parse({
        userId: userId,
        items: [item],
        sessionCartId: sessionCartId,
        ...calcPrice([item]),
      });

      await prisma.cart.create({
        data: newCart,
      });

      revalidatePath(`/product/${product.slug}`);
      return {
        success: true,
        message: "Item added to cart successfully",
      };
    } else {
      const existItem = (cart.items as cartItem[]).find(
        (currItem) => currItem.productId === item.productId
      );
      if (existItem) {
        if (product.stock < existItem.qty + 1) {
          throw new Error("Not Enough stock");
        }
        (cart.items as cartItem[]).find(
          (currItem) => currItem.productId === item.productId
        )!.qty = existItem.qty + 1;
      } else {
        if (product.stock < 1) throw new Error("Not enough stock");
        cart.items.push(item);
      }

      await prisma.cart.update({
        where: { id: cart.id },
        data: {
          items: cart.items as Prisma.CartUpdateitemsInput[],
          ...calcPrice(cart.items as cartItem[]),
        },
      });

      revalidatePath(`/product/${product.slug}`);

      return {
        success: true,
        message: `${product.name} ${
          existItem ? "updated in" : "added to"
        } cart sucessfully`,
      };
    }
  } catch (error) {}
  return {
    success: true,
    message: "item added to cart",
  };
}

export async function getMyCart() {
  const sessionCartId = (await cookies()).get("sessionCartId")?.value;
  if (!sessionCartId) throw new Error("Cart  Session not found");
  const session = await auth();
  const userId = session?.user?.id ? (session.user.id as string) : undefined;

  const cart = await prisma.cart.findFirst({
    where: userId ? { userId: userId } : { sessionCartId: sessionCartId },
  });
  if (!cart) return undefined;

  return convertToPlainObject({
    ...cart,
    items: cart.items as cartItem[],
    itemsPrice: cart.itemsPrice.toString(),
    totalPrice: cart.totalPrice.toString(),
    shippingPrice: cart.shippingPrice.toString(),
    taxPrice: cart.taxPrice.toString(),
  });
}

export async function removeItemFromCart(productId: string) {
  try {
    const sessionCartId = (await cookies()).get("sessionCartId")?.value;
    if (!sessionCartId) throw new Error("Cart Session not found");

    const product = await prisma.product.findFirst({
      where: { id: productId },
    });
    if (!product) throw new Error("Product not found");

    const cart = await getMyCart();

    if (!cart) throw new Error("Cart not found");
    const exist = cart.items.find((item) => item.productId === productId);

    if (!exist) throw new Error("Item not found");

    if (exist.qty === 1) {
      cart.items = cart.items.filter((item) => {
        console.log(item.productId === exist.productId);
        return item.productId !== exist.productId;
      });
    } else {
      cart.items.find((item) => {
        return item.productId === productId;
      })!.qty = exist.qty - 1;
    }

    await prisma.cart.update({
      where: { id: cart.id },
      data: {
        items: cart.items as Prisma.CartUpdateitemsInput[],
        ...calcPrice(cart.items as cartItem[]),
      },
    });

    revalidatePath(`/product/${product.slug}`);

    return {
      success: true,
      message: `${product.name} ${
        (cart.items as cartItem[]).find((item) => item.productId === productId)
          ? "updated in"
          : "removed from"
      }cart successfully`,
    };
  } catch (error) {
    return {
      success: false,
      message: formatError(error),
    };
  }
}
