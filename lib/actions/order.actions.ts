"use server";

import { auth } from "@/auth";
import { prisma } from "@/db/prisma";
import { revalidatePath } from "next/cache";
import { convertToPlainObject, formatError } from "../utils";
import { cartItem } from "@/types";
import { getMyCart } from "./cart.actions";
import { getGuestCheckoutData } from "./guest-checkout.actions";

// Create Order
export async function createOrder() {
  try {
    const session = await auth();
    const isGuest = !session?.user?.id;

    let userId: string;
    let shippingAddress: object;
    let paymentMethod: string;

    if (isGuest) {
     
      const guestData = await getGuestCheckoutData();
      if (!guestData?.address) throw new Error("Shipping address is required");
      if (!guestData?.paymentMethod) throw new Error("Payment method is required");
      if (!guestData?.email) throw new Error("Email is required for guest checkout");

      shippingAddress = guestData.address;
      paymentMethod = guestData.paymentMethod;

      // Find or create a guest user by email
      let guestUser = await prisma.user.findFirst({
        where: { email: guestData.email },
      });
      if (!guestUser) {
        guestUser = await prisma.user.create({
          data: {
            email: guestData.email,
            name: guestData.address.fullName,
            role: "user",
          },
        });
      }
      userId = guestUser.id;
    } else {
      
      userId = session.user.id!;
      const user = await prisma.user.findFirst({ where: { id: userId } });
      if (!user) throw new Error("User not found");
      if (!user.address) throw new Error("Shipping address is required");
      if (!user.paymentMethod) throw new Error("Payment method is required");
      shippingAddress = user.address as object;
      paymentMethod = user.paymentMethod;
    }

    // Get cart (works for both guest and authenticated)
    const cart = await getMyCart();
    if (!cart || cart.items.length === 0) throw new Error("Cart is empty");

    const cartItems = cart.items as cartItem[];

    const order = await prisma.$transaction(async (tx) => {
      // ✅ SINGLE BATCH QUERY: Fetch all products at once instead of N+1 queries
      const productIds = cartItems.map((item) => item.productId);
      const products = await tx.product.findMany({
        where: {
          id: { in: productIds },
        },
        select: {
          id: true,
          name: true,
          stock: true,
        },
      });

      // Create lookup map for O(1) access
      const productMap = new Map(products.map((p) => [p.id, p]));

      // Validate in-memory (same logic as before, just 5x faster)
      for (const item of cartItems) {
        const product = productMap.get(item.productId);
        
        if (!product) {
          throw new Error(`Product ${item.name} not found`);
        }
        
        if (product.stock < item.qty) {
          throw new Error(
            `Insufficient stock for ${item.name}. Available: ${product.stock}, Requested: ${item.qty}`
          );
        }
      }

      const newOrder = await tx.order.create({
        data: {
          userId,
          shippingAddress,
          paymentMethod,
          itemsPrice: cart.itemsPrice,
          shippingPrice: cart.shippingPrice,
          taxPrice: cart.taxPrice,
          totalPrice: cart.totalPrice,
          isPaid: false,
          deliveredAt: new Date("2099-12-31"),
        },
      });

      await tx.orderItem.createMany({
        data: cartItems.map((item) => ({
          orderId: newOrder.id,
          productId: item.productId,
          name: item.name,
          qty: item.qty,
          price: item.price.toString(),
          image: item.image,
        })),
      });

      return newOrder;
    });

    revalidatePath("/cart");
    revalidatePath("/user/orders");
    revalidatePath("/");

    return {
      success: true,
      message: "Order placed successfully",
      orderId: order.id,
    };
  } catch (error) {
    return { success: false, message: await formatError(error) };
  }
}

// Get User Orders
export async function getUserOrders() {
  const session = await auth();
  const userId = session?.user?.id;
  if (!userId) throw new Error("Unauthorized");

  const orders = await prisma.order.findMany({
    where: { userId },
    include: { orderItems: true },
    orderBy: { createdAt: "desc" },
  });

  return convertToPlainObject(
    orders.map((order) => ({
      ...order,
      itemsPrice: order.itemsPrice.toString(),
      shippingPrice: order.shippingPrice.toString(),
      taxPrice: order.taxPrice.toString(),
      totalPrice: order.totalPrice.toString(),
      orderItems: order.orderItems.map((item) => ({
        ...item,
        price: item.price.toString(),
      })),
    }))
  );
}

// Get Order By ID
export async function getOrderById(orderId: string) {
  const session = await auth();
  const userId = session?.user?.id;
  if (!userId) throw new Error("Unauthorized");

  const order = await prisma.order.findFirst({
    where: { id: orderId },
    include: {
      user: { select: { name: true, email: true } },
      orderItems: true,
    },
  });

  if (!order) throw new Error("Order not found");

  if (order.userId !== userId && session.user.role !== "admin") {
    throw new Error("Unauthorized to view this order");
  }

  return convertToPlainObject({
    ...order,
    itemsPrice: order.itemsPrice.toString(),
    shippingPrice: order.shippingPrice.toString(),
    taxPrice: order.taxPrice.toString(),
    totalPrice: order.totalPrice.toString(),
    orderItems: order.orderItems.map((item) => ({
      ...item,
      price: item.price.toString(),
    })),
  });
}

// Guest order lookup by email + orderId (no auth required)
export async function lookupGuestOrder(email: string, orderId: string) {
  try {
    const order = await prisma.order.findFirst({
      where: {
        id: orderId,
        user: { email },
      },
      include: { orderItems: true },
    });

    if (!order) {
      return { success: false, message: "No order found with that email and order ID" };
    }

    return {
      success: true,
      data: convertToPlainObject({
        ...order,
        itemsPrice: order.itemsPrice.toString(),
        shippingPrice: order.shippingPrice.toString(),
        taxPrice: order.taxPrice.toString(),
        totalPrice: order.totalPrice.toString(),
        orderItems: order.orderItems.map((item) => ({
          ...item,
          price: item.price.toString(),
        })),
      }),
    };
  } catch (error) {
    return { success: false, message: await formatError(error) };
  }
}
