"use client";

import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Search, Loader, Package } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { FormatCurrency } from "@/lib/utils";
import { lookupGuestOrder } from "@/lib/actions/order.actions";

const schema = z.object({
  email: z.string().email("Enter a valid email"),
  orderId: z.string().min(8, "Enter a valid order ID"),
});

type FormValues = z.infer<typeof schema>;

export default function OrderLookupPage() {
  const [isPending, startTransition] = useTransition();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [order, setOrder] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { email: "", orderId: "" },
  });

  function onSubmit(values: FormValues) {
    startTransition(async () => {
      setError(null);
      setOrder(null);
      const res = await lookupGuestOrder(values.email, values.orderId);
      if (res.success) {
        setOrder(res.data);
      } else {
        setError(res.message);
      }
    });
  }

  return (
    <div className="wrapper py-12">
      <div className="max-w-lg mx-auto space-y-6">
        <div className="text-center space-y-2">
          <Package className="h-10 w-10 mx-auto text-primary" />
          <h1 className="h2-bold">Track Your Order</h1>
          <p className="text-muted-foreground text-sm">
            Enter your email and order ID to check your order status
          </p>
        </div>

        <Card>
          <CardContent className="p-6">
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-4"
              >
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email Address</FormLabel>
                      <FormControl>
                        <Input
                          type="email"
                          placeholder="your@email.com"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="orderId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Order ID</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="From your confirmation email"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type="submit" disabled={isPending} className="w-full">
                  {isPending ? (
                    <Loader className="h-4 w-4 animate-spin mr-2" />
                  ) : (
                    <Search className="h-4 w-4 mr-2" />
                  )}
                  Find Order
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>

        {error && (
          <Card className="border-destructive">
            <CardContent className="p-4">
              <p className="text-sm text-destructive">{error}</p>
            </CardContent>
          </Card>
        )}

        {order && (
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center justify-between">
                <span>Order #{order.id.slice(0, 8).toUpperCase()}</span>
                <Badge variant={order.isPaid ? "outline" : "destructive"}>
                  {order.isPaid ? "Paid" : "Unpaid"}
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div>
                  <p className="text-muted-foreground">Date</p>
                  <p className="font-medium">
                    {new Date(order.createdAt).toLocaleDateString()}
                  </p>
                </div>
                <div>
                  <p className="text-muted-foreground">Total</p>
                  <p className="font-medium">
                    {FormatCurrency(order.totalPrice)}
                  </p>
                </div>
                <div>
                  <p className="text-muted-foreground">Delivery</p>
                  <Badge variant="outline" className="mt-1">
                    {order.isDelivered ? "Delivered" : "Processing"}
                  </Badge>
                </div>
                <div>
                  <p className="text-muted-foreground">Items</p>
                  <p className="font-medium">{order.orderItems.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
