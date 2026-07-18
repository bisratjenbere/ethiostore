import { ShoppingCart } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface CartBadgeProps {
  itemCount: number;
}

export default function CartBadge({ itemCount }: CartBadgeProps) {
  return (
    <div className="relative inline-flex">
      <ShoppingCart />
      {itemCount > 0 && (
        <Badge 
          className="absolute -top-2 -right-2 h-5 min-w-5 flex items-center justify-center p-0 text-xs"
          variant="destructive"
        >
          {itemCount > 99 ? "99+" : itemCount}
        </Badge>
      )}
    </div>
  );
}
