"use client";

import { useEffect, useState } from "react";
import { getMyCart } from "@/lib/actions/cart.actions";
import AddToCart from "./add-to-cart";
import { Skeleton } from "@/components/ui/skeleton";
import { Cart } from "@/types";

interface AddToCartWrapperProps {
  item: {
    productId: string;
    name: string;
    slug: string;
    price: number;
    qty: number;
    image: string;
  };
}

const AddToCartWrapper = ({ item }: AddToCartWrapperProps) => {
  const [cart, setCart] = useState<Cart | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCart = async () => {
      const cartData = await getMyCart();
      setCart(cartData);
      setLoading(false);
    };

    fetchCart();
  }, []);

  if (loading) {
    return (
      <div className="space-y-2">
        <Skeleton className="h-12 w-full" />
      </div>
    );
  }

  return <AddToCart cart={cart} item={item} />;
};

export default AddToCartWrapper;
