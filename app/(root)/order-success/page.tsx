import { Suspense } from "react";
import { redirect } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle, Loader, Package } from "lucide-react";
import Link from "next/link";
import { getStripeCheckoutSession } from "@/lib/actions/stripe.actions";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Payment Successful - ProStore",
};

async function OrderSuccessContent({
  searchParams,
}: {
  searchParams: Promise<{ session_id?: string }>;
}) {
  const params = await searchParams;
  const sessionId = params.session_id;

  if (!sessionId) {
    redirect("/");
  }

  // Retrieve and verify the checkout session
  const sessionResult = await getStripeCheckoutSession(sessionId);

  if (!sessionResult.success || !sessionResult.data) {
    return (
      <Card className="max-w-2xl mx-auto mt-8">
        <CardHeader>
          <CardTitle className="text-destructive">
            Unable to Verify Payment
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground mb-4">
            We couldn't verify your payment. Please check your order history or
            contact support.
          </p>
          <div className="flex gap-4">
            <Link href="/user/orders">
              <Button>View Orders</Button>
            </Link>
            <Link href="/">
              <Button variant="outline">Back to Home</Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    );
  }

  const { data } = sessionResult;

  return (
    <div className="max-w-2xl mx-auto mt-8 space-y-6">
      {/* Success Banner */}
      <Card className="border-green-200 bg-green-50 dark:bg-green-950 dark:border-green-800">
        <CardContent className="pt-6">
          <div className="flex items-start gap-4">
            <CheckCircle className="h-12 w-12 text-green-600 dark:text-green-400 flex-shrink-0" />
            <div className="flex-1">
              <h1 className="text-2xl font-bold text-green-900 dark:text-green-100 mb-2">
                Payment Successful!
              </h1>
              <p className="text-green-700 dark:text-green-300">
                Thank you for your order. Your payment has been processed
                successfully.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Order Details */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Package className="h-5 w-5" />
            Order Details
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-muted-foreground">Order ID</p>
              <p className="font-mono text-sm">
                {data.orderId?.slice(0, 8).toUpperCase()}
              </p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Payment Status</p>
              <p className="font-semibold capitalize">{data.paymentStatus}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Amount Paid</p>
              <p className="font-semibold">
                ${((data.amountTotal || 0) / 100).toFixed(2)}
              </p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Email</p>
              <p className="text-sm">{data.customerEmail}</p>
            </div>
          </div>

          <div className="pt-4 border-t">
            <h3 className="font-semibold mb-2">What's Next?</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li className="flex items-start gap-2">
                <span className="text-primary">✓</span>
                <span>
                  You will receive an order confirmation email shortly
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary">✓</span>
                <span>
                  Track your order status in the orders section
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary">✓</span>
                <span>
                  We'll notify you when your order ships
                </span>
              </li>
            </ul>
          </div>

          <div className="flex gap-4 pt-4">
            <Link href={`/user/order/${data.orderId}`} className="flex-1">
              <Button className="w-full">View Order Details</Button>
            </Link>
            <Link href="/shop" className="flex-1">
              <Button variant="outline" className="w-full">
                Continue Shopping
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>

      {/* Additional Info */}
      <Card>
        <CardContent className="pt-6">
          <p className="text-sm text-muted-foreground text-center">
            Having trouble? Contact our support team or visit your{" "}
            <Link href="/user/orders" className="text-primary hover:underline">
              order history
            </Link>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}

export default function OrderSuccessPage({
  searchParams,
}: {
  searchParams: Promise<{ session_id?: string }>;
}) {
  return (
    <Suspense
      fallback={
        <Card className="max-w-2xl mx-auto mt-8">
          <CardContent className="pt-6 flex flex-col items-center justify-center py-12">
            <Loader className="h-8 w-8 animate-spin text-primary mb-4" />
            <p className="text-muted-foreground">Verifying payment...</p>
          </CardContent>
        </Card>
      }
    >
      <OrderSuccessContent searchParams={searchParams} />
    </Suspense>
  );
}
