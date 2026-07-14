"use client";

import { useTransition } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { CreditCard, Loader } from "lucide-react";
import { toast } from "sonner";
import { createOrder } from "@/lib/actions/order.actions";
import { createStripeCheckoutSession } from "@/lib/actions/stripe.actions";

const PlaceOrderButton = ({ isGuest }: { isGuest?: boolean }) => {
  const [isPending, startTransition] = useTransition();

  const handlePlaceOrder = () => {
    startTransition(async () => {
      const orderRes = await createOrder();
      if (!orderRes.success) {
        toast.error(orderRes.message);
        return;
      }

      const stripeRes = await createStripeCheckoutSession(orderRes.orderId!);
      if (!stripeRes.success || !stripeRes.url) {
        toast.error(stripeRes.message || "Failed to create checkout session");
        return;
      }

      toast.success("Redirecting to payment...");
      window.location.href = stripeRes.url;
    });
  };

  return (
    <Card>
      <CardContent className="p-4 space-y-3">
        <Button
          onClick={handlePlaceOrder}
          disabled={isPending}
          className="w-full"
          size="lg"
        >
          {isPending ? (
            <Loader className="h-4 w-4 animate-spin mr-2" />
          ) : (
            <CreditCard className="h-4 w-4 mr-2" />
          )}
          {isPending ? "Processing..." : "Proceed to Payment"}
        </Button>
        <p className="text-xs text-muted-foreground text-center">
          {isGuest
            ? "Checking out as guest — you'll receive a confirmation email"
            : "You will be redirected to Stripe for secure payment"}
        </p>
      </CardContent>
    </Card>
  );
};

export default PlaceOrderButton;
