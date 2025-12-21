"use client";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
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
import { ArrowRight, Loader, Minus, Plus } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useTransition } from "react";
import { toast } from "sonner";

const CartTable = ({ cart }: { cart?: Cart }) => {
  const [isPending, startTransition] = useTransition();
  return (
    <>
      <h1 className="py-4">Shopping Cart</h1>

      {!cart || cart.items.length === 0 ? (
        <div>
          Cart Is Empty.
          <Link href="/">Go Shooping</Link>
        </div>
      ) : (
        <div className="grid md:grid-cols-4 md:gap-5">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Item</TableHead>
                  <TableHead>Quantity</TableHead>
                  <TableHead>Price</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {cart.items.map((item) => {
                  return (
                    <TableRow key={item.slug}>
                      <TableCell>
                        <Link
                          className="flex items-center"
                          href={`/product/${item.slug}`}
                        >
                          <Image
                            src={item.image}
                            alt={item.name}
                            height={50}
                            width={50}
                          />
                        </Link>
                        <span className="px-2">{item.name}</span>
                      </TableCell>

                      <TableCell className="flex-center gap-2">
                        <Button
                          disabled={isPending}
                          variant="outline"
                          type="button"
                          onClick={() => {
                            startTransition(async () => {
                              const res = await removeItemFromCart(
                                item.productId
                              );
                              if (!res.success) {
                                toast.error(res.message);
                              }
                            });
                          }}
                        >
                          {isPending ? (
                            <Loader className="w-4 h-4 animate-spin" />
                          ) : (
                            <Minus className="w-4 h-4" />
                          )}
                        </Button>
                        <span>{item.qty}</span>
                        <Button
                          disabled={isPending}
                          variant="outline"
                          type="button"
                          onClick={() => {
                            startTransition(async () => {
                              const res = await addItemToCart(item);
                              if (!res.success) toast.error(res.message);
                            });
                          }}
                        >
                          {isPending ? (
                            <Loader className="w-4 h-4 animate-spin" />
                          ) : (
                            <Plus />
                          )}
                        </Button>
                      </TableCell>

                      <TableCell className="text-right align-top">
                        ${item.price}
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>

          <Card>
            <CardContent className="p-4 gap-4">
              <div className="pb-3 text-xl">
                SubTotal (
                {cart.items.reduce((acc, curr) => acc + curr.price, 0)})
                <span className="font-bold">
                  {FormatCurrency(cart.itemsPrice)}
                </span>
              </div>
              <Button>
                {isPending ? (
                  <Loader className="animate-spin h-4 w-4" />
                ) : (
                  <ArrowRight className="w-4 h-4" />
                )}
                Proceed to Checkout
              </Button>
            </CardContent>
          </Card>
        </div>
      )}
    </>
  );
};

export default CartTable;
