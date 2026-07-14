import { Metadata } from "next";
import MetricCard from "@/components/admin/dashboard/metric-card";
import RecentOrders from "@/components/admin/dashboard/recent-orders";
import { DollarSign, ShoppingCart, Package, Users, Clock, AlertCircle } from "lucide-react";
import { getDashboardMetrics } from "@/lib/actions/admin.actions";

export const metadata: Metadata = {
  title: "Admin Dashboard",
};

export default async function AdminDashboardPage() {
  const result = await getDashboardMetrics();

  if (!result.success || !result.data) {
    return (
      <div className="space-y-6">
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <div className="rounded-lg border border-destructive bg-destructive/10 p-4">
          <p className="text-destructive">{result.message}</p>
        </div>
      </div>
    );
  }

  const metrics = result.data;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <p className="text-muted-foreground">
          Overview of your store performance
        </p>
      </div>

      {/* Primary Metrics Grid */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <MetricCard
          title="Total Revenue"
          value={`$${Number(metrics.totalRevenue).toLocaleString()}`}
          icon={DollarSign}
        />
        <MetricCard
          title="Total Orders"
          value={metrics.totalOrders.toString()}
          icon={ShoppingCart}
        />
        <MetricCard
          title="Products"
          value={metrics.totalProducts.toString()}
          icon={Package}
        />
        <MetricCard
          title="Customers"
          value={metrics.totalUsers.toString()}
          icon={Users}
        />
      </div>

      {/* Secondary Metrics Grid */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <MetricCard
          title="Orders Today"
          value={metrics.ordersToday.toString()}
          icon={Clock}
        />
        <MetricCard
          title="Revenue Today"
          value={`$${Number(metrics.revenueToday).toLocaleString()}`}
          icon={DollarSign}
        />
        <MetricCard
          title="Pending Orders"
          value={metrics.pendingOrders.toString()}
          icon={AlertCircle}
        />
      </div>

      {/* Recent Orders */}
      <RecentOrders 
        orders={metrics.recentOrders.map(order => ({
          ...order,
          createdAt: order.createdAt.toString()
        }))} 
      />
    </div>
  );
}
