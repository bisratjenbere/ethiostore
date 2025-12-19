"use client";
import { Button } from "@/components/ui/button";
import { addItemToCart } from "@/lib/actions/cart.actions";
import { cartItem } from "@/types";
import { Plus } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
const AddToCart = ({ item }: { item: Omit<cartItem, "cartId"> }) => {
  const router = useRouter();
  const handleAddToCart = async () => {
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
        <span>{item.name} added to the cart</span>
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
  };

  return (
    <Button type="button" className="w-full" onClick={handleAddToCart}>
      <Plus />
      Add to cart
    </Button>
  );
};

export default AddToCart;
