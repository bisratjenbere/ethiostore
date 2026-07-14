"use client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { addItemToCart, removeItemFromCart } from "@/lib/actions/cart.actions";
import { FormatCurrency } from "@/lib/utils";
import { Cart } from "@/types";
import { ArrowRight, Loader, Minus, Plus, ShoppingBag, Trash2, Truck } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { toast } from "sonner";

const CartTable = ({ cart }: { cart?: Cart }) => {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();
  
  // Empty state
  if (!cart || cart.items.length === 0) {
    return (
      <div className="wrapper py-12">
        <div className="max-w-md mx-auto text-center space-y-6">
          <div className="flex justify-center">
            <div className="rounded-full bg-muted p-6">
              <ShoppingBag className="h-12 w-12 text-muted-foreground" />
            </div>
          </div>
          <div className="space-y-2">
            <h2 className="h2-bold">Your cart is empty</h2>
            <p className="text-muted-foreground">
              Looks like you haven't added anything to your cart yet
            </p>
          </div>
          <Button asChild size="lg">
            <Link href="/shop">
              Start Shopping
            </Link>
          </Button>
        </div>
      </div>
    );
  }
  
  // Calculate free shipping progress
  const FREE_SHIPPING_THRESHOLD = 100;
  const itemsPrice = Number(cart.itemsPrice);
  const remaining = Math.max(0, FREE_SHIPPING_THRESHOLD - itemsPrice);
  const progress = Math.min((itemsPrice / FREE_SHIPPING_THRESHOLD) * 100, 100);
  
  return (
    <div className="wrapper py-8">
      <div className="space-y-8">
        {/* Header */}
        <div>
          <h1 className="h2-bold">Shopping Cart</h1>
          <p className="text-muted-foreground mt-2">
            {cart.items.length} {cart.items.length === 1 ? 'item' : 'items'} in your cart
          </p>
        </div>
        
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Cart Items - Desktop Table View */}
          <div className="lg:col-span-2">
            {/* Desktop View */}
            <div className="hidden md:block">
              <Card>
                <CardContent className="p-6">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Product</TableHead>
                        <TableHead>Price</TableHead>
                        <TableHead className="text-center">Quantity</TableHead>
                        <TableHead className="text-right">Total</TableHead>
                        <TableHead className="w-[50px]"></TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {cart.items.map((item) => (
                        <TableRow key={item.slug}>
                          <TableCell>
                            <Link
                              href={`/product/${item.slug}`}
                              className="flex items-center gap-4 hover:opacity-75 transition-opacity"
                            >
                              <div className="relative w-20 h-20 rounded-lg overflow-hidden bg-muted flex-shrink-0">
                                <Image
                                  src={item.image}
                                  alt={item.name}
                                  fill
                                  className="object-cover"
                                />
                              </div>
                              <div className="min-w-0">
                                <p className="font-medium line-clamp-2">{item.name}</p>
                              </div>
                            </Link>
                          </TableCell>
                          <TableCell>
                            <span className="font-medium">{FormatCurrency(item.price)}</span>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center justify-center gap-2">
                              <Button
                                disabled={isPending}
                                variant="outline"
                                size="icon"
                                className="h-8 w-8"
                                onClick={() => {
                                  startTransition(async () => {
                                    const res = await removeItemFromCart(item.productId);
                                    if (!res.success) {
                                      toast.error(res.message);
                                    }
                                  });
                                }}
                              >
                                {isPending ? (
                                  <Loader className="h-4 w-4 animate-spin" />
                                ) : (
                                  <Minus className="h-4 w-4" />
                                )}
                              </Button>
                              <span className="w-8 text-center font-medium">{item.qty}</span>
                              <Button
                                disabled={isPending}
                                variant="outline"
                                size="icon"
                                className="h-8 w-8"
                                onClick={() => {
                                  startTransition(async () => {
                                    const res = await addItemToCart(item);
                                    if (!res.success) toast.error(res.message);
                                  });
                                }}
                              >
                                {isPending ? (
                                  <Loader className="h-4 w-4 animate-spin" />
                                ) : (
                                  <Plus className="h-4 w-4" />
                                )}
                              </Button>
                            </div>
                          </TableCell>
                          <TableCell className="text-right font-medium">
                            {FormatCurrency(item.price * item.qty)}
                          </TableCell>
                          <TableCell>
                            <Button
                              disabled={isPending}
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 text-destructive hover:text-destructive"
                              onClick={() => {
                                startTransition(async () => {
                                  // Remove all quantity
                                  for (let i = 0; i < item.qty; i++) {
                                    await removeItemFromCart(item.productId);
                                  }
                                });
                              }}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </div>
            
            {/* Mobile View - Cards */}
            <div className="md:hidden space-y-4">
              {cart.items.map((item) => (
                <Card key={item.slug}>
                  <CardContent className="p-4">
                    <div className="flex gap-4">
                      <Link href={`/product/${item.slug}`} className="flex-shrink-0">
                        <div className="relative w-24 h-24 rounded-lg overflow-hidden bg-muted">
                          <Image
                            src={item.image}
                            alt={item.name}
                            fill
                            className="object-cover"
                          />
                        </div>
                      </Link>
                      <div className="flex-1 min-w-0 space-y-2">
                        <Link href={`/product/${item.slug}`}>
                          <h3 className="font-medium line-clamp-2 hover:text-primary transition-colors">
                            {item.name}
                          </h3>
                        </Link>
                        <p className="text-lg font-bold">{FormatCurrency(item.price)}</p>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <Button
                              disabled={isPending}
                              variant="outline"
                              size="icon"
                              className="h-8 w-8"
                              onClick={() => {
                                startTransition(async () => {
                                  const res = await removeItemFromCart(item.productId);
                                  if (!res.success) toast.error(res.message);
                                });
                              }}
                            >
                              <Minus className="h-4 w-4" />
                            </Button>
                            <span className="w-8 text-center font-medium">{item.qty}</span>
                            <Button
                              disabled={isPending}
                              variant="outline"
                              size="icon"
                              className="h-8 w-8"
                              onClick={() => {
                                startTransition(async () => {
                                  const res = await addItemToCart(item);
                                  if (!res.success) toast.error(res.message);
                                });
                              }}
                            >
                              <Plus className="h-4 w-4" />
                            </Button>
                          </div>
                          <Button
                            disabled={isPending}
                            variant="ghost"
                            size="sm"
                            className="text-destructive hover:text-destructive"
                            onClick={() => {
                              startTransition(async () => {
                                for (let i = 0; i < item.qty; i++) {
                                  await removeItemFromCart(item.productId);
                                }
                              });
                            }}
                          >
                            <Trash2 className="h-4 w-4 mr-1" />
                            Remove
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
          
          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="sticky top-20 space-y-4">
              {/* Free Shipping Progress */}
              {remaining > 0 && (
                <Card className="bg-amber-50 border-amber-200">
                  <CardContent className="p-4 space-y-3">
                    <div className="flex items-start gap-3">
                      <Truck className="h-5 w-5 text-amber-600 flex-shrink-0 mt-0.5" />
                      <div className="space-y-2 flex-1">
                        <p className="text-sm font-medium text-amber-900">
                          Add {FormatCurrency(remaining)} more for <strong>FREE shipping!</strong>
                        </p>
                        <div className="h-2 bg-amber-200 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-amber-500 transition-all duration-500"
                            style={{ width: `${progress}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}
              
              {remaining <= 0 && (
                <Card className="bg-green-50 border-green-200">
                  <CardContent className="p-4">
                    <div className="flex items-center gap-3">
                      <Truck className="h-5 w-5 text-green-600" />
                      <p className="text-sm font-medium text-green-900">
                        You've qualified for <strong>FREE shipping!</strong> 🎉
                      </p>
                    </div>
                  </CardContent>
                </Card>
              )}
              
              {/* Order Summary Card */}
              <Card>
                <CardHeader>
                  <CardTitle>Order Summary</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">
                        Subtotal ({cart.items.reduce((acc, item) => acc + item.qty, 0)} items)
                      </span>
                      <span className="font-medium">{FormatCurrency(cart.itemsPrice)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Shipping</span>
                      <span className="font-medium">
                        {Number(cart.shippingPrice) === 0 ? (
                          <span className="text-green-600">FREE</span>
                        ) : (
                          FormatCurrency(cart.shippingPrice)
                        )}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Tax</span>
                      <span className="font-medium">{FormatCurrency(cart.taxPrice)}</span>
                    </div>
                  </div>
                  <div className="border-t pt-4">
                    <div className="flex justify-between items-center mb-4">
                      <span className="text-lg font-semibold">Total</span>
                      <span className="text-2xl font-bold">{FormatCurrency(cart.totalPrice)}</span>
                    </div>
                    <Button
                      disabled={isPending}
                      onClick={() =>
                        startTransition(() => {
                          router.push("/shipping-address");
                        })
                      }
                      className="w-full"
                      size="lg"
                    >
                      {isPending ? (
                        <Loader className="animate-spin h-4 w-4 mr-2" />
                      ) : (
                        <ArrowRight className="h-4 w-4 mr-2" />
                      )}
                      Proceed to Checkout
                    </Button>
                  </div>
                  <div className="text-center">
                    <Link href="/shop" className="text-sm text-primary hover:underline">
                      Continue Shopping
                    </Link>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartTable;
