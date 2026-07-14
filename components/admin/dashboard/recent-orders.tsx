import Link from "next/link";
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
import { FormatCurrency } from "@/lib/utils";
import { ArrowRight } from "lucide-react";

type Order = {
  id: string;
  createdAt: string;
  totalPrice: string;
  isPaid: boolean;
  isDelivered: boolean;
  user: {
    name: string;
    email: string;
  };
};

export default function RecentOrders({ orders }: { orders: Order[] }) {
  if (orders.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Recent Orders</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-center text-muted-foreground">No recent orders</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
        <CardTitle>Recent Orders</CardTitle>
        <Button variant="ghost" size="sm" asChild>
          <Link href="/admin/orders">
            View All
            <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </Button>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Order ID</TableHead>
              <TableHead>Customer</TableHead>
              <TableHead>Total</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {orders.map((order) => (
              <TableRow key={order.id}>
                <TableCell className="font-mono text-sm">
                  {order.id.slice(0, 8)}...
                </TableCell>
                <TableCell>
                  <div>
                    <div className="font-medium">{order.user.name}</div>
                    <div className="text-sm text-muted-foreground">
                      {order.user.email}
                    </div>
                  </div>
                </TableCell>
                <TableCell className="font-medium">
                  {FormatCurrency(Number(order.totalPrice))}
                </TableCell>
                <TableCell>
                  <div className="flex gap-2">
                    {order.isPaid ? (
                      <Badge variant="outline" className="bg-green-100">
                        Paid
                      </Badge>
                    ) : (
                      <Badge variant="destructive">Unpaid</Badge>
                    )}
                  </div>
                </TableCell>
                <TableCell>
                  <Button variant="outline" size="sm" asChild>
                    <Link href={`/admin/orders/${order.id}`}>View</Link>
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
