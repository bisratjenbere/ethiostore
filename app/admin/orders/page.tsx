import { Metadata } from "next";
import { getAllOrders } from "@/lib/actions/admin.actions";
import AdminOrdersTable from "@/components/admin/orders/admin-orders-table";
import { Suspense } from "react";

export const metadata: Metadata = {
  title: "Order Management",
};

export default async function AdminOrdersPage({
  searchParams,
}: {
  searchParams: Promise<{
    page?: string;
    isPaid?: string;
    isDelivered?: string;
    search?: string;
  }>;
}) {
  const params = await searchParams;
  const page = params.page || "1";
  const isPaid = params.isPaid || "all";
  const isDelivered = params.isDelivered || "all";
  const search = params.search || "";

  const result = await getAllOrders({
    page: Number(page),
    limit: 20,
    isPaid,
    isDelivered,
    search,
  });

  if (!result.success || !result.data) {
    return (
      <div className="space-y-6">
        <h1 className="text-3xl font-bold">Order Management</h1>
        <div className="rounded-lg border border-destructive bg-destructive/10 p-4">
          <p className="text-destructive">{result.message}</p>
        </div>
      </div>
    );
  }

  const data = result.data;
  const { orders, total, pages, currentPage } = data;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Order Management</h1>
        <p className="text-muted-foreground">
          View and manage all orders ({total} total)
        </p>
      </div>

      <Suspense fallback={<div>Loading...</div>}>
        <AdminOrdersTable
          orders={orders.map(order => ({
            ...order,
            createdAt: typeof order.createdAt === 'string' ? order.createdAt : order.createdAt.toISOString(),
            paidAt: order.paidAt ? (typeof order.paidAt === 'string' ? order.paidAt : order.paidAt.toISOString()) : null,
            deliveredAt: order.deliveredAt ? (typeof order.deliveredAt === 'string' ? order.deliveredAt : order.deliveredAt.toISOString()) : null,
          }))}
          currentPage={currentPage}
          totalPages={pages}
          filters={{
            isPaid,
            isDelivered,
            search,
          }}
        />
      </Suspense>
    </div>
  );
}
