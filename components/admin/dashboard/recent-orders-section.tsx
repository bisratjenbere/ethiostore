import { getDashboardMetrics } from "@/lib/actions/admin.actions";
import RecentOrders from "./recent-orders";

export default async function RecentOrdersSection() {
  const result = await getDashboardMetrics();
  
  if (!result.success || !result.data) {
    return null;
  }
  
  const metrics = result.data;
  
  return (
    <RecentOrders 
      orders={metrics.recentOrders.map(order => ({
        ...order,
        createdAt: order.createdAt.toString()
      }))} 
    />
  );
}
