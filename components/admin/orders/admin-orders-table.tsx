"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { FormatCurrency } from "@/lib/utils";
import OrderActions from "@/components/admin/orders/order-actions";
import { Search } from "lucide-react";

type Order = {
  id: string;
  createdAt: string;
  totalPrice: string;
  isPaid: boolean;
  paidAt: string | null;
  isDelivered: boolean;
  deliveredAt: string | null;
  user: {
    id: string;
    name: string;
    email: string;
  };
};

type AdminOrdersTableProps = {
  orders: Order[];
  currentPage: number;
  totalPages: number;
  filters: {
    isPaid: string;
    isDelivered: string;
    search: string;
  };
};

export default function AdminOrdersTable({
  orders,
  currentPage,
  totalPages,
  filters,
}: AdminOrdersTableProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [searchValue, setSearchValue] = useState(filters.search);

  const updateFilters = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value && value !== "all") {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    // Reset to page 1 when filtering
    if (key !== "page") {
      params.set("page", "1");
    }
    router.push(`/admin/orders?${params.toString()}`);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    updateFilters("search", searchValue);
  };

  const goToPage = (page: number) => {
    updateFilters("page", page.toString());
  };

  if (orders.length === 0) {
    return (
      <div className="space-y-4">
        {/* Filters */}
        <div className="flex flex-col gap-4 sm:flex-row">
          <form onSubmit={handleSearch} className="flex flex-1 gap-2">
            <Input
              placeholder="Search by order ID or customer email..."
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              className="flex-1"
            />
            <Button type="submit" size="icon">
              <Search className="h-4 w-4" />
            </Button>
          </form>

          <Select
            value={filters.isPaid}
            onValueChange={(value) => updateFilters("isPaid", value)}
          >
            <SelectTrigger className="w-full sm:w-[180px]">
              <SelectValue placeholder="Payment Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Payments</SelectItem>
              <SelectItem value="true">Paid</SelectItem>
              <SelectItem value="false">Unpaid</SelectItem>
            </SelectContent>
          </Select>

          <Select
            value={filters.isDelivered}
            onValueChange={(value) => updateFilters("isDelivered", value)}
          >
            <SelectTrigger className="w-full sm:w-[180px]">
              <SelectValue placeholder="Delivery Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Deliveries</SelectItem>
              <SelectItem value="true">Delivered</SelectItem>
              <SelectItem value="false">Pending</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="rounded-lg border bg-card p-12 text-center">
          <p className="text-muted-foreground">No orders found</p>
          {(filters.search || filters.isPaid !== "all" || filters.isDelivered !== "all") && (
            <Button
              variant="link"
              onClick={() => router.push("/admin/orders")}
              className="mt-2"
            >
              Clear filters
            </Button>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Filters */}
      <div className="flex flex-col gap-4 sm:flex-row">
        <form onSubmit={handleSearch} className="flex flex-1 gap-2">
          <Input
            placeholder="Search by order ID or customer email..."
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            className="flex-1"
          />
          <Button type="submit" size="icon">
            <Search className="h-4 w-4" />
          </Button>
        </form>

        <Select
          value={filters.isPaid}
          onValueChange={(value) => updateFilters("isPaid", value)}
        >
          <SelectTrigger className="w-full sm:w-[180px]">
            <SelectValue placeholder="Payment Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Payments</SelectItem>
            <SelectItem value="true">Paid</SelectItem>
            <SelectItem value="false">Unpaid</SelectItem>
          </SelectContent>
        </Select>

        <Select
          value={filters.isDelivered}
          onValueChange={(value) => updateFilters("isDelivered", value)}
        >
          <SelectTrigger className="w-full sm:w-[180px]">
            <SelectValue placeholder="Delivery Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Deliveries</SelectItem>
            <SelectItem value="true">Delivered</SelectItem>
            <SelectItem value="false">Pending</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Table */}
      <div className="rounded-lg border bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Order ID</TableHead>
              <TableHead>Customer</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Total</TableHead>
              <TableHead>Payment</TableHead>
              <TableHead>Delivery</TableHead>
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
                <TableCell>
                  {new Date(order.createdAt).toLocaleDateString()}
                </TableCell>
                <TableCell className="font-medium">
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
                  {order.isDelivered ? (
                    <Badge variant="outline" className="bg-blue-100">
                      Delivered
                    </Badge>
                  ) : (
                    <Badge variant="outline">Pending</Badge>
                  )}
                </TableCell>
                <TableCell>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" asChild>
                      <Link href={`/admin/orders/${order.id}`}>View</Link>
                    </Button>
                    <OrderActions order={order} />
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => goToPage(currentPage - 1)}
            disabled={currentPage === 1}
          >
            Previous
          </Button>
          <div className="flex gap-1">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <Button
                key={page}
                variant={page === currentPage ? "default" : "outline"}
                size="sm"
                onClick={() => goToPage(page)}
              >
                {page}
              </Button>
            ))}
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => goToPage(currentPage + 1)}
            disabled={currentPage === totalPages}
          >
            Next
          </Button>
        </div>
      )}
    </div>
  );
}
