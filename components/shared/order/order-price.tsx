import { Card, CardContent } from "@/components/ui/card";
import { FormatCurrency } from "@/lib/utils";
import { Cart } from "@/types";

const OrderPrice = ({ order }: { order: Cart }) => {
  return (
    <div>
      <Card>
        <CardContent className="p-4 gap-4 space-y-4">
          <div className="flex justify-between">
            <div>Items</div>
            <div>{FormatCurrency(order.itemsPrice)}</div>
          </div>
          <div className="flex justify-between">
            <div>Tax</div>
            <div>{FormatCurrency(order.taxPrice)}</div>
          </div>
          <div className="flex justify-between">
            <div>Shipping</div>
            <div>{FormatCurrency(order.shippingPrice)}</div>
          </div>
          <div className="flex justify-between">
            <div>Total</div>
            <div>{FormatCurrency(order.totalPrice)}</div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default OrderPrice;
