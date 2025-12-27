import { auth } from "@/auth";
import CheckOutSteps from "@/components/shared/checkout-steps";
import UserOrderItems from "@/components/shared/order/order-items";
import OrderPrice from "@/components/shared/order/order-price";
import UserAddress from "@/components/shared/user/add-address";
import UserPaymentMethod from "@/components/shared/user/add-payment-method";
import { getMyCart } from "@/lib/actions/cart.actions";
import { getUserById } from "@/lib/actions/user.actions";
import { ShippingAddress } from "@/types";
import { Metadata } from "next";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
  title: "Place Order",
};

const PlaceOrderPage = async () => {
  const cart = await getMyCart();
  const session = await auth();
  const userId = session?.user.id;
  if (!userId) throw new Error("User not authenticated");
  const user = await getUserById(userId);

  if (!cart || cart.items.length === 0) redirect("/cart");
  if (!user.address) redirect("/shipping-address");
  if (!user.paymentMethod) redirect("/payment-method");
  const userAddress = user.address as ShippingAddress;

  return (
    <>
      <CheckOutSteps current={3} />
      <h1 className="py-4 text-2xl">place Order</h1>
      <div className="grid md:grid-cols-3 md:gap-5">
        <div className="overflow-x-auto md:col-span-2 space-y-4">
          <UserAddress address={userAddress} />
          <UserPaymentMethod paymentMethod={user.paymentMethod} />
          <UserOrderItems userCart={cart} />
        </div>
        <div>
          <OrderPrice order={cart} />
        </div>
      </div>
    </>
  );
};

export default PlaceOrderPage;
