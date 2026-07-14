import { Metadata } from "next";
import { notFound } from "next/navigation";
import { getOrderById } from "@/lib/actions/order.actions";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { FormatCurrency } from "@/lib/utils";
import { ShippingAddress } from "@/types";
import { ArrowLeft, CheckCircle, Clock, MapPin, Package, Truck } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Order Details",
};

const OrderDetailsPage = async (props: {
  params: Promise<{ id: string }>;
}) => {
  const params = await props.params;
  const { id } = params;

  let order;
  try {
    order = await getOrderById(id);
  } catch (error) {
    notFound();
  }

  const shippingAddress = order.shippingAddress as ShippingAddress;

  return (
    <div className="wrapper py-8">
      <div className="space-y-6">
        {/* Header with Back Button */}
        <div className="flex items-center gap-4">
          <Button variant="outline" size="icon" asChild>
            <Link href="/user/orders">
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </Button>
          <div>
            <h1 className="h2-bold">Order Details</h1>
            <p className="text-sm text-muted-foreground">
              Order #{order.id.slice(0, 8).toUpperCase()}
            </p>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            {/* Order Status Card */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Package className="h-5 w-5" />
                  Order Status
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">Order Date</p>
                    <p className="font-medium">
                      {new Date(order.createdAt).toLocaleDateString(undefined, {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">Order Time</p>
                    <p className="font-medium">
                      {new Date(order.createdAt).toLocaleTimeString(undefined, {
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </p>
                  </div>
                </div>
                
                <div className="grid sm:grid-cols-2 gap-4 pt-4 border-t">
                  <div className="space-y-2">
                    <p className="text-sm text-muted-foreground">Payment Status</p>
                    {order.isPaid ? (
                      <div className="space-y-1">
                        <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                          <CheckCircle className="h-3 w-3 mr-1" />
                          Paid
                        </Badge>
                        {order.paidAt && (
                          <p className="text-xs text-muted-foreground">
                            on {new Date(order.paidAt).toLocaleDateString()}
                          </p>
                        )}
                      </div>
                    ) : (
                      <Badge variant="destructive">
                        <Clock className="h-3 w-3 mr-1" />
                        Payment Pending
                      </Badge>
                    )}
                  </div>
                  
                  <div className="space-y-2">
                    <p className="text-sm text-muted-foreground">Delivery Status</p>
                    {order.isDelivered ? (
                      <div className="space-y-1">
                        <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                          <Truck className="h-3 w-3 mr-1" />
                          Delivered
                        </Badge>
                        {order.deliveredAt && (
                          <p className="text-xs text-muted-foreground">
                            on {new Date(order.deliveredAt).toLocaleDateString()}
                          </p>
                        )}
                      </div>
                    ) : (
                      <Badge variant="outline">
                        <Package className="h-3 w-3 mr-1" />
                        Processing
                      </Badge>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Shipping Address Card */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MapPin className="h-5 w-5" />
                  Shipping Address
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-1 text-sm">
                  <p className="font-semibold">{shippingAddress.fullName}</p>
                  <p className="text-muted-foreground">{shippingAddress.streetAddress}</p>
                  <p className="text-muted-foreground">
                    {shippingAddress.city}, {shippingAddress.postalCode}
                  </p>
                  <p className="text-muted-foreground">{shippingAddress.country}</p>
                </div>
              </CardContent>
            </Card>

            {/* Payment Method Card */}
            <Card>
              <CardHeader>
                <CardTitle>Payment Method</CardTitle>
              </CardHeader>
              <CardContent>
                <Badge variant="outline" className="text-sm">
                  {order.paymentMethod}
                </Badge>
              </CardContent>
            </Card>

            {/* Order Items Card */}
            <Card>
              <CardHeader>
                <CardTitle>Order Items</CardTitle>
              </CardHeader>
              <CardContent>
                {/* Desktop Table */}
                <div className="hidden md:block">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Product</TableHead>
                        <TableHead className="text-center">Quantity</TableHead>
                        <TableHead className="text-right">Price</TableHead>
                        <TableHead className="text-right">Total</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {order.orderItems.map((item) => (
                        <TableRow key={item.productId}>
                          <TableCell>
                            <div className="flex items-center gap-3">
                              <div className="relative w-16 h-16 rounded-lg overflow-hidden bg-muted flex-shrink-0">
                                <Image
                                  src={item.image}
                                  alt={item.name}
                                  fill
                                  className="object-cover"
                                />
                              </div>
                              <span className="font-medium">{item.name}</span>
                            </div>
                          </TableCell>
                          <TableCell className="text-center">{item.qty}</TableCell>
                          <TableCell className="text-right">{FormatCurrency(item.price)}</TableCell>
                          <TableCell className="text-right font-medium">
                            {FormatCurrency(Number(item.price) * item.qty)}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
                
                {/* Mobile Cards */}
                <div className="md:hidden space-y-4">
                  {order.orderItems.map((item) => (
                    <div key={item.productId} className="flex gap-3 pb-4 border-b last:border-0 last:pb-0">
                      <div className="relative w-20 h-20 rounded-lg overflow-hidden bg-muted flex-shrink-0">
                        <Image
                          src={item.image}
                          alt={item.name}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div className="flex-1 space-y-1">
                        <p className="font-medium text-sm">{item.name}</p>
                        <p className="text-sm text-muted-foreground">Qty: {item.qty}</p>
                        <p className="font-semibold">
                          {FormatCurrency(Number(item.price) * item.qty)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Order Summary Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-20">
              <Card>
                <CardHeader>
                  <CardTitle>Order Summary</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Subtotal</span>
                      <span>{FormatCurrency(order.itemsPrice)}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Shipping</span>
                      <span>
                        {Number(order.shippingPrice) === 0 ? (
                          <span className="text-green-600 font-medium">FREE</span>
                        ) : (
                          FormatCurrency(order.shippingPrice)
                        )}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Tax</span>
                      <span>{FormatCurrency(order.taxPrice)}</span>
                    </div>
                  </div>
                  <div className="border-t pt-4">
                    <div className="flex items-center justify-between mb-4">
                      <span className="font-semibold text-lg">Total</span>
                      <span className="font-bold text-2xl">
                        {FormatCurrency(order.totalPrice)}
                      </span>
                    </div>
                  </div>
                  
                  <Button variant="outline" className="w-full" asChild>
                    <Link href="/shop">Continue Shopping</Link>
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetailsPage;
