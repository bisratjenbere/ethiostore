import { Metadata } from "next";
import { getUserOrders } from "@/lib/actions/order.actions";
import OrdersTable from "@/components/shared/order/orders-table";

export const metadata: Metadata = {
  title: "My Orders",
};

const OrdersPage = async () => {
  const orders = await getUserOrders();

  return (
    <div className="wrapper py-8">
      <div className="space-y-6">
        <div>
          <h1 className="h2-bold">My Orders</h1>
          <p className="text-muted-foreground mt-2">
            View and track all your orders
          </p>
        </div>
        <OrdersTable orders={orders} />
      </div>
    </div>
  );
};

export default OrdersPage;
