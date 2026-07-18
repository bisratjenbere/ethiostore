import { Button } from "@/components/ui/button";
import ModeToggle from "./mode-toggle";
import Link from "next/link";
import { EllipsisVertical } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

import UserButton from "./user-button";
import CartBadge from "./cart-badge";
import { getMyCart } from "@/lib/actions/cart.actions";

const Menu = async () => {
  // Fetch cart data to calculate item count
  const cart = await getMyCart();
  const itemCount = cart?.items.reduce((sum, item) => sum + item.qty, 0) || 0;

  return (
    <div className="flex justify-end gap-3">
      <nav className="md:flex hidden w-full gap-1 max-w-xs">
        <Button asChild variant="ghost">
          <Link href="/shop">Shop</Link>
        </Button>
        <ModeToggle />
        <Button asChild variant="ghost">
          <Link href="/cart">
            <CartBadge itemCount={itemCount} />
            Cart
          </Link>
        </Button>
        <UserButton />
      </nav>
      <nav className="md:hidden">
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" aria-label="Open menu">
              <EllipsisVertical />
            </Button>
          </SheetTrigger>
          <SheetContent className="flex flex-col items-start">
            <SheetTitle>Menu</SheetTitle>
            <Button asChild variant="ghost">
              <Link href="/shop">Shop</Link>
            </Button>
            <ModeToggle />
            <Button asChild variant="ghost">
              <Link href="/cart">
                <CartBadge itemCount={itemCount} />
                Cart
              </Link>
            </Button>
            <UserButton />
          </SheetContent>
        </Sheet>
      </nav>
    </div>
  );
};

export default Menu;
