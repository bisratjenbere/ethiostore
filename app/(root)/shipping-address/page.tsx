import { auth } from "@/auth";
import { getMyCart } from "@/lib/actions/cart.actions";
import { getUserById } from "@/lib/actions/user.actions";
import { getGuestCheckoutData } from "@/lib/actions/guest-checkout.actions";
import { Metadata } from "next";
import { redirect } from "next/navigation";
import ShippingAddressForm from "./shipping-address-form";
import { ShippingAddress } from "@/types";

export const metadata: Metadata = { title: "Shipping Address" };

const ShippingAddressPage = async () => {
  const cart = await getMyCart();
  if (!cart || cart.items.length === 0) redirect("/cart");

  const session = await auth();
  const userId = session?.user?.id;

  let address: ShippingAddress | null = null;
  let guestEmail: string | undefined;

  if (userId) {
    const user = await getUserById(userId);
    address = user.address as ShippingAddress | null;
  } else {
    const guestData = await getGuestCheckoutData();
    address = guestData?.address ?? null;
    guestEmail = guestData?.email;
  }

  return (
    <ShippingAddressForm
      address={address}
      isGuest={!userId}
      guestEmail={guestEmail}
    />
  );
};

export default ShippingAddressPage;
