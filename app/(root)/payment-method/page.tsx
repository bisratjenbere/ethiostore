import { auth } from "@/auth";
import { getUserById } from "@/lib/actions/user.actions";
import { getGuestCheckoutData } from "@/lib/actions/guest-checkout.actions";
import { Metadata } from "next";
import { redirect } from "next/navigation";
import PaymentMethodForm from "./payment-method-form";

export const metadata: Metadata = { title: "Payment Method" };

const PaymentMethodPage = async () => {
  const session = await auth();
  const userId = session?.user?.id;

  let preferredPaymentMethod: string | null = null;
  let isGuest = false;

  if (userId) {
    const user = await getUserById(userId);
    preferredPaymentMethod = user.paymentMethod;
  } else {
    const guestData = await getGuestCheckoutData();
    // Redirect back to shipping if no address yet
    if (!guestData?.address) redirect("/shipping-address");
    preferredPaymentMethod = guestData.paymentMethod ?? null;
    isGuest = true;
  }

  return (
    <PaymentMethodForm
      preferredPaymentMethod={preferredPaymentMethod}
      isGuest={isGuest}
    />
  );
};

export default PaymentMethodPage;
