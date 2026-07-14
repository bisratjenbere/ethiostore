import { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { getUserDetails } from "@/lib/actions/admin.actions";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { FormatCurrency } from "@/lib/utils";
import RoleSelector from "@/components/admin/users/role-selector";

export const metadata: Metadata = {
  title: "User Details",
};

export default async function AdminUserDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const result = await getUserDetails(id);

  if (!result.success || !result.data) {
    notFound();
  }

  const user = result.data;
  const address = user.address as {
    fullName?: string;
    streetAddress?: string;
    city?: string;
    postalCode?: string;
    country?: string;
  } | null;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" asChild>
            <Link href="/admin/users">
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </Button>
          <div>
            <h1 className="text-3xl font-bold">User Details</h1>
            <p className="text-sm text-muted-foreground">{user.email}</p>
          </div>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <div className="space-y-6 md:col-span-2">
          {/* Profile Information */}
          <Card>
            <CardHeader>
              <CardTitle>Profile Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <div className="text-sm font-medium">Name</div>
                  <div className="text-sm text-muted-foreground">
                    {user.name}
                  </div>
                </div>
                <div>
                  <div className="text-sm font-medium">Email</div>
                  <div className="text-sm text-muted-foreground">
                    {user.email}
                  </div>
                </div>
                <div>
                  <div className="text-sm font-medium">Role</div>
                  <div className="mt-1">
                    <RoleSelector userId={user.id} currentRole={user.role} />
                  </div>
                </div>
                <div>
                  <div className="text-sm font-medium">Registration Date</div>
                  <div className="text-sm text-muted-foreground">
                    {new Date(user.createdAt).toLocaleDateString()}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Shipping Address */}
          <Card>
            <CardHeader>
              <CardTitle>Shipping Address</CardTitle>
            </CardHeader>
            <CardContent>
              {address ? (
                <address className="text-sm not-italic">
                  <div>{address.fullName || "N/A"}</div>
                  <div>{address.streetAddress || "N/A"}</div>
                  <div>
                    {address.city || "N/A"}, {address.postalCode || "N/A"}
                  </div>
                  <div>{address.country || "N/A"}</div>
                </address>
              ) : (
                <p className="text-sm text-muted-foreground">
                  No address on file
                </p>
              )}
            </CardContent>
          </Card>

          {/* Order History */}
          <Card>
            <CardHeader>
              <CardTitle>Order History ({user.orders.length})</CardTitle>
            </CardHeader>
            <CardContent>
              {user.orders.length === 0 ? (
                <p className="text-sm text-muted-foreground">No orders yet</p>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Order ID</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Total</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {user.orders.slice(0, 10).map((order) => (
                      <TableRow key={order.id}>
                        <TableCell className="font-mono text-sm">
                          {order.id.slice(0, 8)}...
                        </TableCell>
                        <TableCell>
                          {new Date(order.createdAt).toLocaleDateString()}
                        </TableCell>
                        <TableCell>
                          {FormatCurrency(Number(order.totalPrice))}
                        </TableCell>
                        <TableCell>
                          {order.isPaid ? (
                            <Badge variant="outline" className="bg-green-100">
                              Paid
                            </Badge>
                          ) : (
                            <Badge variant="destructive">Unpaid</Badge>
                          )}
                        </TableCell>
                        <TableCell>
                          <Button variant="outline" size="sm" asChild>
                            <Link href={`/admin/orders/${order.id}`}>
                              View
                            </Link>
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
              {user.orders.length > 10 && (
                <div className="mt-4 text-center">
                  <p className="text-sm text-muted-foreground">
                    Showing first 10 orders
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          {/* Account Statistics */}
          <Card>
            <CardHeader>
              <CardTitle>Account Statistics</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <div className="text-sm font-medium">Total Spent</div>
                <div className="text-2xl font-bold">
                  {FormatCurrency(Number(user.totalSpent))}
                </div>
              </div>
              <div>
                <div className="text-sm font-medium">Total Orders</div>
                <div className="text-2xl font-bold">{user.orders.length}</div>
              </div>
              <div>
                <div className="text-sm font-medium">Paid Orders</div>
                <div className="text-sm text-muted-foreground">
                  {user.orders.filter((o) => o.isPaid).length}
                </div>
              </div>
              <div>
                <div className="text-sm font-medium">Delivered Orders</div>
                <div className="text-sm text-muted-foreground">
                  {user.orders.filter((o) => o.isDelivered).length}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Payment Method */}
          <Card>
            <CardHeader>
              <CardTitle>Payment Method</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm">
                {user.paymentMethod || (
                  <span className="text-muted-foreground">Not set</span>
                )}
              </p>
            </CardContent>
          </Card>

          {/* Account Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Account Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button variant="outline" className="w-full" asChild>
                <Link href={`/admin/orders?search=${user.email}`}>
                  View All Orders
                </Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
