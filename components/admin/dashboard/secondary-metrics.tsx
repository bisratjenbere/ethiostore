import { getDashboardMetrics } from "@/lib/actions/admin.actions";
import MetricCard from "./metric-card";
import { Clock, DollarSign, AlertCircle } from "lucide-react";

export default async function SecondaryMetrics() {
  const result = await getDashboardMetrics();
  
  if (!result.success || !result.data) {
    return null;
  }
  
  const metrics = result.data;
  
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
      <MetricCard
        title="Orders Today"
        value={metrics.ordersToday.toString()}
        icon={Clock}
      />
      <MetricCard
        title="Revenue Today"
        value={`${Number(metrics.revenueToday).toLocaleString()}`}
        icon={DollarSign}
      />
      <MetricCard
        title="Pending Orders"
        value={metrics.pendingOrders.toString()}
        icon={AlertCircle}
      />
    </div>
  );
}
