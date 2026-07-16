import Footer from "@/components/footer";
import Header from "@/components/shared/header";
import PromotionalBanner from "@/components/shared/homepage/promotional-banner";
import { SessionProvider } from "next-auth/react";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <SessionProvider>
      <div className="flex h-screen flex-col">
        {/* Sticky navigation wrapper */}
        <div className="sticky top-0 z-50">
          <PromotionalBanner />
          <Header />
        </div>
        <main className="flex-1 wrapper">{children}</main>
        <Footer />
      </div>
    </SessionProvider>
  );
}
