export const APP_NAME = process.env.NEXT_PUBLIC_APP_NAME || "prostore";

export const APP_DESCRIPTION =
  process.env.NEXT_PUBLIC_APP_DESCRIPTION ||
  "A modern store built with Next.js, ShadCN, and Prisma.";
export const APP_URL =
  process.env.NEXT_PUBLIC_SERVER_URL || "http://localhost:3000";
export const LATEST_PRODUCT_LIMIT =
  Number(process.env.LATEST_PRODUCT_LIMIT) || 4;

export const navLinks = [
  {
    title: "Profile",
    href: "/user/profile",
  },
  {
    title: "Orders",
    href: "/user/orders",
  },
];

export const shippingAddressDefaultValues = {
  fullName: "John Doe",
  streetAddress: "123 Main St",
  city: "Anytown",
  postalCode: "12345",
  country: "USA",
};

export const checkOutSteps = [
  "User Login",
  "shipping Address",
  "Payment Address",
  "Place Order",
];

export const protectedPaths = [
  /\/shipping-address/,
  /\/payment-method/,
  /\/place-order/,
  /\/profile/,
  /\/user\/(.*)/,
  /\/order\/(.*)/,
  /\/admin/,
];
