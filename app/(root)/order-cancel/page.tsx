import { Suspense } from "react";
import { XCircle, ShoppingCart, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

function OrderCancelContent({
  searchParams,
}: {
  searchParams: { order_id?: string };
}) {
  return (
    <div className="container mx-auto py-16 px-4">
      <Card className="max-w-2xl mx-auto">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <XCircle className="h-16 w-16 text-orange-500" />
          </div>
          <CardTitle className="text-3xl">Payment Cancelled</CardTitle>
        </CardHeader>
        <CardContent className="text-center space-y-6">
          <p className="text-muted-foreground text-lg">
            Your payment was cancelled and no charges were made.
          </p>

          {searchParams.order_id && (
            <div className="bg-muted p-4 rounded-md">
              <p className="text-sm text-muted-foreground">
                Your order is still pending payment.
              </p>
              <p className="text-sm font-mono text-muted-foreground mt-2">
                Order ID: {searchParams.order_id.slice(0, 30)}...
              </p>
            </div>
          )}

          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">
              You can try again or return to your cart to make changes.
            </p>

            <div className="flex gap-4 justify-center flex-wrap">
              <Button asChild>
                <Link href="/place-order">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Try Again
                </Link>
              </Button>
              <Button variant="outline" asChild>
                <Link href="/cart">
                  <ShoppingCart className="h-4 w-4 mr-2" />
                  Back to Cart
                </Link>
              </Button>
            </div>
          </div>

          <div className="pt-6 border-t">
            <h3 className="font-semibold mb-2">Need help?</h3>
            <p className="text-sm text-muted-foreground">
              If you experienced any issues during checkout, please contact our
              support team.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default async function OrderCancelPage(props: {
  searchParams: Promise<{ order_id?: string }>;
}) {
  const searchParams = await props.searchParams;

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <OrderCancelContent searchParams={searchParams} />
    </Suspense>
  );
}

export const metadata = {
  title: "Order Cancelled",
};
