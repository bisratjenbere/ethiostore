import { auth } from "@/auth";
import CheckOutSteps from "@/components/shared/checkout-steps";
import UserOrderItems from "@/components/shared/order/order-items";
import OrderPrice from "@/components/shared/order/order-price";
import UserAddress from "@/components/shared/user/add-address";
import UserPaymentMethod from "@/components/shared/user/add-payment-method";
import PlaceOrderButton from "@/components/shared/order/place-order-button";
import { StripePaymentInfo } from "@/components/shared/payment/stripe-badge";
import { getMyCart } from "@/lib/actions/cart.actions";
import { getUserById } from "@/lib/actions/user.actions";
import { getGuestCheckoutData } from "@/lib/actions/guest-checkout.actions";
import { ShippingAddress } from "@/types";
import { Metadata } from "next";
import { redirect } from "next/navigation";

export const metadata: Metadata = { title: "Place Order" };

const PlaceOrderPage = async () => {
  const cart = await getMyCart();
  if (!cart || cart.items.length === 0) redirect("/cart");

  const session = await auth();
  const userId = session?.user?.id;

  let userAddress: ShippingAddress;
  let paymentMethod: string;
  let isGuest = false;

  if (userId) {
    const user = await getUserById(userId);
    if (!user.address) redirect("/shipping-address");
    if (!user.paymentMethod) redirect("/payment-method");
    userAddress = user.address as ShippingAddress;
    paymentMethod = user.paymentMethod;
  } else {
    const guestData = await getGuestCheckoutData();
    if (!guestData?.address) redirect("/shipping-address");
    if (!guestData?.paymentMethod) redirect("/payment-method");
    userAddress = guestData.address;
    paymentMethod = guestData.paymentMethod;
    isGuest = true;
  }

  return (
    <>
      <CheckOutSteps current={3} />
      <h1 className="py-4 text-2xl">Place Order</h1>
      <div className="grid md:grid-cols-3 md:gap-5">
        <div className="overflow-x-auto md:col-span-2 space-y-4">
          <UserAddress address={userAddress} />
          <UserPaymentMethod paymentMethod={paymentMethod} />
          <UserOrderItems userCart={cart} />
        </div>
        <div className="space-y-4">
          <OrderPrice order={cart} />
          <StripePaymentInfo />
          <PlaceOrderButton isGuest={isGuest} />
        </div>
      </div>
    </>
  );
};

export default PlaceOrderPage;
