import Link from "next/link";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { FormatCurrency } from "@/lib/utils";
import { Package } from "lucide-react";

type Order = {
  id: string;
  createdAt: Date;
  totalPrice: string;
  isPaid: boolean;
  paidAt: Date | null;
  isDelivered: boolean;
  deliveredAt: Date | null;
};

const OrdersTable = ({ orders }: { orders: Order[] }) => {
  // Empty state
  if (orders.length === 0) {
    return (
      <Card>
        <CardContent className="py-12">
          <div className="text-center space-y-4">
            <div className="flex justify-center">
              <div className="rounded-full bg-muted p-6">
                <Package className="h-12 w-12 text-muted-foreground" />
              </div>
            </div>
            <div className="space-y-2">
              <h3 className="text-lg font-semibold">No orders yet</h3>
              <p className="text-muted-foreground max-w-sm mx-auto">
                Start shopping to place your first order and track it here
              </p>
            </div>
            <Button asChild>
              <Link href="/shop">Start Shopping</Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      {/* Desktop Table View */}
      <div className="hidden md:block">
        <Card>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Order ID</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Total</TableHead>
                  <TableHead>Payment</TableHead>
                  <TableHead>Delivery</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {orders.map((order) => (
                  <TableRow key={order.id}>
                    <TableCell className="font-mono text-sm">
                      {order.id.slice(0, 8).toUpperCase()}
                    </TableCell>
                    <TableCell className="text-sm">
                      {new Date(order.createdAt).toLocaleDateString(undefined, {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric'
                      })}
                    </TableCell>
                    <TableCell className="font-medium">
                      {FormatCurrency(order.totalPrice)}
                    </TableCell>
                    <TableCell>
                      {order.isPaid ? (
                        <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                          Paid
                        </Badge>
                      ) : (
                        <Badge variant="destructive">Unpaid</Badge>
                      )}
                    </TableCell>
                    <TableCell>
                      {order.isDelivered ? (
                        <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                          Delivered
                        </Badge>
                      ) : (
                        <Badge variant="outline">Pending</Badge>
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      <Button variant="outline" size="sm" asChild>
                        <Link href={`/user/order/${order.id}`}>
                          View Details
                        </Link>
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </Card>
      </div>

      {/* Mobile Card View */}
      <div className="md:hidden space-y-4">
        {orders.map((order) => (
          <Card key={order.id}>
            <CardContent className="p-4 space-y-3">
              <div className="flex items-start justify-between">
                <div className="space-y-1">
                  <p className="text-xs text-muted-foreground">Order ID</p>
                  <p className="font-mono text-sm font-medium">
                    {order.id.slice(0, 8).toUpperCase()}
                  </p>
                </div>
                <div className="text-right space-y-1">
                  <p className="text-xs text-muted-foreground">Date</p>
                  <p className="text-sm">
                    {new Date(order.createdAt).toLocaleDateString(undefined, {
                      month: 'short',
                      day: 'numeric'
                    })}
                  </p>
                </div>
              </div>
              
              <div className="flex items-center justify-between pt-2 border-t">
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Total</p>
                  <p className="text-lg font-bold">
                    {FormatCurrency(order.totalPrice)}
                  </p>
                </div>
                <div className="flex gap-2">
                  {order.isPaid ? (
                    <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                      Paid
                    </Badge>
                  ) : (
                    <Badge variant="destructive">Unpaid</Badge>
                  )}
                  {order.isDelivered ? (
                    <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                      Delivered
                    </Badge>
                  ) : (
                    <Badge variant="outline">Pending</Badge>
                  )}
                </div>
              </div>
              
              <Button variant="outline" size="sm" className="w-full" asChild>
                <Link href={`/user/order/${order.id}`}>
                  View Order Details
                </Link>
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </>
  );
};

export default OrdersTable;
