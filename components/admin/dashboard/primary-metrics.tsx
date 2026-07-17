import { getDashboardMetrics } from "@/lib/actions/admin.actions";
import MetricCard from "./metric-card";
import { DollarSign, ShoppingCart, Package, Users } from "lucide-react";

export default async function PrimaryMetrics() {
  const result = await getDashboardMetrics();
  
  if (!result.success || !result.data) {
    return (
      <div className="rounded-lg border border-destructive bg-destructive/10 p-4">
        <p className="text-destructive">{result.message}</p>
      </div>
    );
  }
  
  const metrics = result.data;
  
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      <MetricCard
        title="Total Revenue"
        value={`${Number(metrics.totalRevenue).toLocaleString()}`}
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
  );
}
