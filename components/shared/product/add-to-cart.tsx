"use client";
import { Button } from "@/components/ui/button";
import { addItemToCart, removeItemFromCart } from "@/lib/actions/cart.actions";
import { Cart, cartItem } from "@/types";
import { Loader, Minus, Plus } from "lucide-react";
import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { toast } from "sonner";
const AddToCart = ({
  item,
  cart,
}: {
  item: Omit<cartItem, "cartId">;
  cart?: Cart;
}) => {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const handleAddToCart = async () => {
    startTransition(async () => {
      const res = await addItemToCart(item);
      if (!res.success) {
        toast.error(res.message, {
          style: {
            background: "red",
            color: "white",
          },
        });

        return;
      }
      toast.custom((t) => (
        <div className="flex items-center gap-3">
          <span>{res.message} </span>
          <button
            onClick={() => {
              router.push("/cart");
              toast.dismiss(t);
            }}
            className="bg-primary w-1/2 text-white px-2 py-1 rounded"
          >
            Go to cart
          </button>
        </div>
      ));
    });
  };

  const handleRemoveFromCart = async () => {
    startTransition(async () => {
      const res = await removeItemFromCart(item.productId);
      if (res.success) {
        toast(res.message);
      } else {
        toast.error(res.message);
      }
      return;
    });
  };
  const existItem =
    cart &&
    cart.items.find((currItem) => currItem.productId === item.productId);

  return existItem ? (
    <div>
      <Button type="button" variant="outline" onClick={handleRemoveFromCart}>
        {isPending ? (
          <Loader className="animate-spin" />
        ) : (
          <Minus className="w-4 h-4" />
        )}
      </Button>
      <span className="px-2">{existItem.qty}</span>
      <Button type="button" variant="outline" onClick={handleAddToCart}>
        {isPending ? (
          <Loader className="animate-spin" />
        ) : (
          <Plus className="w-4 h-4" />
        )}
      </Button>
    </div>
  ) : (
    <Button className="w-full" type="button" onClick={handleAddToCart}>
      {isPending ? (
        <Loader className="animate-spin" />
      ) : (
        <Plus className="w-4 h-4" />
      )}
      Add to cart
    </Button>
  );
};

export default AddToCart;
