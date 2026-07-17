import { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { prisma } from "@/db/prisma";
import { auth } from "@/auth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ArrowLeft } from "lucide-react";
import OrderActions from "@/components/admin/orders/order-actions";
import { convertToPlainObject } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Order Details",
};

export default async function AdminOrderDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const session = await auth();

  // Verify admin access
  if (session?.user?.role !== "admin") {
    notFound();
  }

  // Fetch order with all relations
  const order = await prisma.order.findUnique({
    where: { id },
    include: {
      user: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
      orderItems: {
        include: {
          product: {
            select: {
              id: true,
              name: true,
              slug: true,
              images: true,
            },
          },
        },
      },
    },
  });

  if (!order) {
    notFound();
  }


  const formattedOrder = convertToPlainObject({
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

  const shippingAddress = order.shippingAddress as {
    fullName: string;
    streetAddress: string;
    city: string;
    postalCode: string;
    country: string;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" asChild>
            <Link href="/admin/orders">
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </Button>
          <div>
            <h1 className="text-3xl font-bold">Order Details</h1>
            <p className="text-sm text-muted-foreground font-mono">
              {order.id}
            </p>
          </div>
        </div>

        <OrderActions order={formattedOrder} />
      </div>

      {/* Status Badges */}
      <div className="flex gap-2">
        {order.isPaid ? (
          <Badge variant="outline" className="bg-green-100">
            Paid
          </Badge>
        ) : (
          <Badge variant="destructive">Unpaid</Badge>
        )}
        {order.isDelivered ? (
          <Badge variant="outline" className="bg-blue-100">
            Delivered
          </Badge>
        ) : (
          <Badge variant="outline">Pending Delivery</Badge>
        )}
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <div className="space-y-6 md:col-span-2">
          {/* Customer Information */}
          <Card>
            <CardHeader>
              <CardTitle>Customer Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div>
                <span className="text-sm font-medium">Name:</span>
                <span className="ml-2 text-sm">{order.user.name}</span>
              </div>
              <div>
                <span className="text-sm font-medium">Email:</span>
                <span className="ml-2 text-sm">{order.user.email}</span>
              </div>
            </CardContent>
          </Card>

          {/* Shipping Address */}
          <Card>
            <CardHeader>
              <CardTitle>Shipping Address</CardTitle>
            </CardHeader>
            <CardContent>
              <address className="text-sm not-italic">
                <div>{shippingAddress.fullName}</div>
                <div>{shippingAddress.streetAddress}</div>
                <div>
                  {shippingAddress.city}, {shippingAddress.postalCode}
                </div>
                <div>{shippingAddress.country}</div>
              </address>
            </CardContent>
          </Card>

          {/* Order Items */}
          <Card>
            <CardHeader>
              <CardTitle>Order Items</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Product</TableHead>
                    <TableHead>Quantity</TableHead>
                    <TableHead className="text-right">Price</TableHead>
                    <TableHead className="text-right">Total</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {formattedOrder.orderItems.map((item) => (
                    <TableRow key={item.productId}>
                      <TableCell>
                        <Link
                          href={`/product/${item.product.slug}`}
                          className="flex items-center gap-3 hover:underline"
                        >
                          <Image
                            src={item.product.images[0]}
                            alt={item.name}
                            width={50}
                            height={50}
                            className="rounded-md object-cover"
                          />
                          <span>{item.name}</span>
                        </Link>
                      </TableCell>
                      <TableCell>{item.qty}</TableCell>
                      <TableCell className="text-right">
                        ${Number(item.price).toFixed(2)}
                      </TableCell>
                      <TableCell className="text-right font-medium">
                        ${(Number(item.price) * item.qty).toFixed(2)}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          {/* Order Timeline */}
          <Card>
            <CardHeader>
              <CardTitle>Order Timeline</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <div className="text-sm font-medium">Created</div>
                <div className="text-sm text-muted-foreground">
                  {new Date(order.createdAt).toLocaleString()}
                </div>
              </div>
              {order.paidAt && (
                <div>
                  <div className="text-sm font-medium">Paid</div>
                  <div className="text-sm text-muted-foreground">
                    {new Date(order.paidAt).toLocaleString()}
                  </div>
                </div>
              )}
              {order.deliveredAt &&
                order.deliveredAt.getFullYear() !== 2099 && (
                  <div>
                    <div className="text-sm font-medium">Delivered</div>
                    <div className="text-sm text-muted-foreground">
                      {new Date(order.deliveredAt).toLocaleString()}
                    </div>
                  </div>
                )}
            </CardContent>
          </Card>

          {/* Payment Information */}
          <Card>
            <CardHeader>
              <CardTitle>Payment Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div>
                <span className="text-sm font-medium">Payment Method:</span>
                <span className="ml-2 text-sm">{order.paymentMethod}</span>
              </div>
              <div>
                <span className="text-sm font-medium">Status:</span>
                <span className="ml-2 text-sm">
                  {order.isPaid ? "Paid" : "Pending Payment"}
                </span>
              </div>
            </CardContent>
          </Card>

          {/* Order Summary */}
          <Card>
            <CardHeader>
              <CardTitle>Order Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Items:</span>
                  <span className="font-medium">
                    ${Number(formattedOrder.itemsPrice).toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Tax:</span>
                  <span className="font-medium">
                    ${Number(formattedOrder.taxPrice).toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Shipping:</span>
                  <span className="font-medium">
                    ${Number(formattedOrder.shippingPrice).toFixed(2)}
                  </span>
                </div>
                <div className="border-t pt-2 flex justify-between font-semibold">
                  <span>Total:</span>
                  <span>
                    ${Number(formattedOrder.totalPrice).toFixed(2)}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
