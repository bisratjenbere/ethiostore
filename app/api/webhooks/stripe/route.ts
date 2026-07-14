import { headers } from "next/headers";
import { NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import {
  markOrderAsPaid,
  markOrderAsPaymentFailed,
} from "@/lib/actions/stripe.actions";
import Stripe from "stripe";

/**
 * Stripe Webhook Handler
 * Listens for payment events from Stripe and updates order status
 * 
 * IMPORTANT: This endpoint MUST be called by Stripe servers, not your frontend
 * Stripe signature verification ensures requests are authentic
 */
export async function POST(req: Request) {
  const body = await req.text();
  const headersList = await headers();
  const signature = headersList.get("stripe-signature");

  if (!signature) {
    return NextResponse.json(
      { error: "Missing stripe-signature header" },
      { status: 400 }
    );
  }

  let event: Stripe.Event;

  try {
    // Verify webhook signature to ensure request is from Stripe
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (err) {
    console.error("Webhook signature verification failed:", err);
    return NextResponse.json(
      { error: `Webhook Error: ${err instanceof Error ? err.message : "Unknown error"}` },
      { status: 400 }
    );
  }

  // Handle the event
  try {
    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object as Stripe.Checkout.Session;
        
        console.log("✅ Payment successful!", {
          sessionId: session.id,
          orderId: session.metadata?.orderId,
          amount: session.amount_total,
        });

        // Extract order ID from metadata
        const orderId = session.metadata?.orderId;
        if (!orderId) {
          throw new Error("Order ID not found in session metadata");
        }

        // Mark order as paid
        const paymentResult = {
          id: session.payment_intent as string,
          status: session.payment_status,
          email: session.customer_email,
          amount: session.amount_total,
          currency: session.currency,
        };

        const result = await markOrderAsPaid(orderId, paymentResult);
        
        if (!result.success) {
          console.error("Failed to mark order as paid:", result.message);
        }

        break;
      }

      case "payment_intent.payment_failed": {
        const paymentIntent = event.data.object as Stripe.PaymentIntent;
        
        console.log("❌ Payment failed!", {
          paymentIntentId: paymentIntent.id,
          reason: paymentIntent.last_payment_error?.message,
        });

        // Extract order ID from metadata
        const orderId = paymentIntent.metadata?.orderId;
        if (!orderId) {
          console.error("Order ID not found in payment intent metadata");
          break;
        }

        // Mark order as payment failed
        const failureReason =
          paymentIntent.last_payment_error?.message || "Payment failed";
        
        await markOrderAsPaymentFailed(orderId, failureReason);

        break;
      }

      case "checkout.session.expired": {
        const session = event.data.object as Stripe.Checkout.Session;
        
        console.log("⏰ Checkout session expired", {
          sessionId: session.id,
          orderId: session.metadata?.orderId,
        });

        // Optionally handle expired sessions
        // You might want to cancel the order or notify the user

        break;
      }

      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    // Return 200 to acknowledge receipt of event
    return NextResponse.json({ received: true });
  } catch (error) {
    console.error("Error processing webhook:", error);
    return NextResponse.json(
      { error: "Webhook handler failed" },
      { status: 500 }
    );
  }
}

/**
 * Disable body parsing, need raw body for signature verification
 */
export const runtime = "nodejs";
