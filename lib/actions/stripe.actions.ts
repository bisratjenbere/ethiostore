"use server";

import { stripe } from "@/lib/stripe";
import { prisma } from "@/db/prisma";
import { revalidatePath } from "next/cache";
import { formatError } from "@/lib/utils";
import { auth } from "@/auth";
import Stripe from "stripe";
import { sendOrderConfirmationEmail } from "@/lib/email/actions/email.actions";

/**
 * Create Stripe Checkout Session
 * 
 * This creates a hosted Stripe checkout page for the user to complete payment.
 * The order must already exist in the database before calling this.
 * 
 * Flow:
 * 1. User clicks "Proceed to Payment"
 * 2. Order is created in database (unpaid)
 * 3. This function creates a Stripe checkout session
 * 4. User is redirected to Stripe's hosted checkout page
 * 5. After payment, Stripe webhook updates order status
 */
export async function createStripeCheckoutSession(orderId: string) {
  try {
    // 1. Verify user is authenticated
    const session = await auth();
    const userId = session?.user?.id;
    if (!userId) {
      throw new Error("Unauthorized - Please sign in");
    }

    // 2. Fetch the order with items
    const order = await prisma.order.findFirst({
      where: { 
        id: orderId,
        // For guests, the order userId is the guest user we created — allow any owner
        ...(userId ? { userId } : {}),
      },
      include: {
        orderItems: {
          include: {
            product: {
              select: {
                name: true,
                images: true,
              }
            }
          }
        },
        user: {
          select: {
            email: true,
            name: true,
          }
        }
      },
    });

    if (!order) {
      throw new Error("Order not found");
    }

    // 3. Check if order is already paid
    if (order.isPaid) {
      throw new Error("Order is already paid");
    }

    // 4. Prepare line items for Stripe
    const lineItems: Stripe.Checkout.SessionCreateParams.LineItem[] = order.orderItems.map((item) => {
      // Convert relative image paths to absolute URLs for Stripe
      let imageUrl: string | undefined;
      if (item.product.images.length > 0) {
        const image = item.product.images[0];
        // If image is already an absolute URL (http/https), use it as-is
        if (image.startsWith('http://') || image.startsWith('https://')) {
          imageUrl = image;
        } 
        // If it's a relative path, convert to absolute URL
        else if (image.startsWith('/')) {
          imageUrl = `${process.env.NEXT_PUBLIC_SERVER_URL}${image}`;
        }
        // Otherwise it might be a Cloudinary URL or other format, try to use it
        else {
          imageUrl = image;
        }
      }

      return {
        price_data: {
          currency: "usd",
          product_data: {
            name: item.name,
            // Only include images if we have a valid absolute URL
            images: imageUrl ? [imageUrl] : [],
            description: `Quantity: ${item.qty}`,
          },
          unit_amount: Math.round(Number(item.price) * 100), // Convert to cents
        },
        quantity: item.qty,
      };
    });

    // Add shipping as a line item
    if (Number(order.shippingPrice) > 0) {
      lineItems.push({
        price_data: {
          currency: "usd",
          product_data: {
            name: "Shipping",
            description: "Standard shipping",
          },
          unit_amount: Math.round(Number(order.shippingPrice) * 100),
        },
        quantity: 1,
      });
    }

    // Add tax as a line item
    if (Number(order.taxPrice) > 0) {
      lineItems.push({
        price_data: {
          currency: "usd",
          product_data: {
            name: "Tax",
            description: "Sales tax",
          },
          unit_amount: Math.round(Number(order.taxPrice) * 100),
        },
        quantity: 1,
      });
    }

    // 5. Create Stripe Checkout Session
    const checkoutSession = await stripe.checkout.sessions.create({
      mode: "payment",
      payment_method_types: ["card"],
      line_items: lineItems,
      customer_email: order.user.email,
      metadata: {
        orderId: order.id,
        userId: userId,
      },
      success_url: `${process.env.NEXT_PUBLIC_SERVER_URL}/order-success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_SERVER_URL}/order-cancelled?orderId=${order.id}`,
      expires_at: Math.floor(Date.now() / 1000) + (30 * 60), // 30 minutes
    });

    // 6. Return the checkout URL
    return {
      success: true,
      message: "Checkout session created",
      url: checkoutSession.url,
      sessionId: checkoutSession.id,
    };

  } catch (error) {
    console.error("Error creating Stripe checkout session:", error);
    return {
      success: false,
      message: formatError(error),
    };
  }
}

/**
 * Mark Order as Paid
 * 
 * Called by Stripe webhook when payment succeeds.
 * Updates order status, decrements stock, and deletes cart.
 * 
 * SECURITY: Only call this from the webhook handler after signature verification!
 */
export async function markOrderAsPaid(
  orderId: string,
  paymentResult: {
    id: string;
    status: string;
    email: string | null;
    amount: number | null;
    currency: string | null;
  }
) {
  try {
    // Find the order with items and user
    const order = await prisma.order.findUnique({
      where: { id: orderId },
      include: {
        orderItems: true,
        user: true,
      },
    });

    if (!order) {
      throw new Error("Order not found");
    }

    // Check if already paid (idempotency)
    if (order.isPaid) {
      console.log(`Order ${orderId} is already marked as paid, skipping update`);
      return {
        success: true,
        message: "Order already marked as paid",
      };
    }

    // Use transaction to ensure atomicity
    await prisma.$transaction(async (tx) => {
      // 1. Update order status
      await tx.order.update({
        where: { id: orderId },
        data: {
          isPaid: true,
          paidAt: new Date(),
          paymentResult: paymentResult as any,
        },
      });

      // 2. Decrement product stock
      for (const item of order.orderItems) {
        await tx.product.update({
          where: { id: item.productId },
          data: {
            stock: {
              decrement: item.qty,
            },
          },
        });
      }

      // 3. Delete user's cart (payment successful, cart no longer needed)
      const cart = await tx.cart.findFirst({
        where: { userId: order.userId },
      });

      if (cart) {
        await tx.cart.delete({
          where: { id: cart.id },
        });
      }
    });

    // Revalidate relevant pages
    revalidatePath(`/user/order/${orderId}`);
    revalidatePath("/user/orders");
    revalidatePath("/admin/orders");
    revalidatePath("/cart");

    console.log(`✅ Order ${orderId} marked as paid, stock decremented, cart deleted`);

    // Send order confirmation email (async, don't wait for it)
    sendOrderConfirmationEmail(orderId).catch(err => {
      console.error('Error sending order confirmation email:', err);
    });

    return {
      success: true,
      message: "Order marked as paid",
    };
  } catch (error) {
    console.error("Error marking order as paid:", error);
    return {
      success: false,
      message: formatError(error),
    };
  }
}

/**
 * Mark Order as Payment Failed
 * 
 * Called by Stripe webhook when payment fails.
 * Stores failure reason in order for debugging.
 * 
 * Note: Order remains unpaid. User can retry payment if needed.
 */
export async function markOrderAsPaymentFailed(
  orderId: string,
  failureReason: string
) {
  try {
    const order = await prisma.order.findUnique({
      where: { id: orderId },
    });

    if (!order) {
      throw new Error("Order not found");
    }

    // Store payment failure information
    await prisma.order.update({
      where: { id: orderId },
      data: {
        paymentResult: {
          status: "failed",
          reason: failureReason,
          timestamp: new Date().toISOString(),
        } as any,
      },
    });

    console.log(`❌ Order ${orderId} payment failed: ${failureReason}`);

    return {
      success: true,
      message: "Order marked as payment failed",
    };
  } catch (error) {
    console.error("Error marking order as payment failed:", error);
    return {
      success: false,
      message: formatError(error),
    };
  }
}

/**
 * Retrieve Stripe Checkout Session
 * 
 * Used on success page to verify payment and show order details.
 * 
 * IMPORTANT: Never trust client-side success redirect alone!
 * Always verify payment status via webhook or session retrieval.
 */
export async function getStripeCheckoutSession(sessionId: string) {
  try {
    const session = await stripe.checkout.sessions.retrieve(sessionId, {
      expand: ["payment_intent"],
    });

    return {
      success: true,
      data: {
        id: session.id,
        status: session.status,
        paymentStatus: session.payment_status,
        amountTotal: session.amount_total,
        currency: session.currency,
        customerEmail: session.customer_email,
        orderId: session.metadata?.orderId,
      },
    };
  } catch (error) {
    console.error("Error retrieving checkout session:", error);
    return {
      success: false,
      message: formatError(error),
    };
  }
}
