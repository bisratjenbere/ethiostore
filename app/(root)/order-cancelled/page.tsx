import { Suspense } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { XCircle, Loader, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Payment Cancelled - ProStore",
};

async function OrderCancelledContent({
  searchParams,
}: {
  searchParams: Promise<{ orderId?: string }>;
}) {
  const params = await searchParams;
  const orderId = params.orderId;

  return (
    <div className="max-w-2xl mx-auto mt-8 space-y-6">
      {/* Cancellation Banner */}
      <Card className="border-yellow-200 bg-yellow-50 dark:bg-yellow-950 dark:border-yellow-800">
        <CardContent className="pt-6">
          <div className="flex items-start gap-4">
            <XCircle className="h-12 w-12 text-yellow-600 dark:text-yellow-400 flex-shrink-0" />
            <div className="flex-1">
              <h1 className="text-2xl font-bold text-yellow-900 dark:text-yellow-100 mb-2">
                Payment Cancelled
              </h1>
              <p className="text-yellow-700 dark:text-yellow-300">
                Your payment was cancelled. No charges were made to your account.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* What Happened */}
      <Card>
        <CardHeader>
          <CardTitle>What Happened?</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-muted-foreground">
            You chose to cancel the payment process or the checkout session expired.
            Your order has been created but remains unpaid.
          </p>

          {orderId && (
            <div className="p-4 bg-muted rounded-lg">
              <p className="text-sm text-muted-foreground mb-1">Order ID</p>
              <p className="font-mono text-sm font-semibold">
                {orderId.slice(0, 8).toUpperCase()}
              </p>
            </div>
          )}

          <div className="pt-4 border-t">
            <h3 className="font-semibold mb-3">What You Can Do:</h3>
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <div className="h-6 w-6 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-xs font-bold text-primary">1</span>
                </div>
                <div>
                  <p className="font-medium">Try Payment Again</p>
                  <p className="text-sm text-muted-foreground">
                    Go back to your cart and complete the checkout process
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="h-6 w-6 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-xs font-bold text-primary">2</span>
                </div>
                <div>
                  <p className="font-medium">Review Your Cart</p>
                  <p className="text-sm text-muted-foreground">
                    Make changes to your order before proceeding
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="h-6 w-6 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-xs font-bold text-primary">3</span>
                </div>
                <div>
                  <p className="font-medium">Continue Shopping</p>
                  <p className="text-sm text-muted-foreground">
                    Browse more products and come back later
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4">
            <Link href="/cart" className="w-full">
              <Button className="w-full" size="lg">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Cart
              </Button>
            </Link>
            <Link href="/shop" className="w-full">
              <Button variant="outline" className="w-full" size="lg">
                Continue Shopping
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>

      {/* Help Section */}
      <Card>
        <CardContent className="pt-6">
          <div className="text-center space-y-2">
            <p className="text-sm text-muted-foreground">
              Need help with your order?
            </p>
            <p className="text-sm">
              Contact our support team or check the{" "}
              <Link href="/user/orders" className="text-primary hover:underline">
                order history
              </Link>{" "}
              for more details.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default function OrderCancelledPage({
  searchParams,
}: {
  searchParams: Promise<{ orderId?: string }>;
}) {
  return (
    <Suspense
      fallback={
        <Card className="max-w-2xl mx-auto mt-8">
          <CardContent className="pt-6 flex flex-col items-center justify-center py-12">
            <Loader className="h-8 w-8 animate-spin text-primary mb-4" />
            <p className="text-muted-foreground">Loading...</p>
          </CardContent>
        </Card>
      }
    >
      <OrderCancelledContent searchParams={searchParams} />
    </Suspense>
  );
}
