"use client";

import { useTransition, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreVertical, DollarSign, Truck, Loader } from "lucide-react";
import { toast } from "sonner";
import {
  updateOrderPaymentStatus,
  updateOrderDeliveryStatus,
} from "@/lib/actions/admin.actions";

type Order = {
  id: string;
  isPaid: boolean;
  isDelivered: boolean;
};

export default function OrderActions({ order }: { order: Order }) {
  const [isPending, startTransition] = useTransition();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogAction, setDialogAction] = useState<
    "markPaid" | "markDelivered" | null
  >(null);

  const handleAction = (action: "markPaid" | "markDelivered") => {
    setDialogAction(action);
    setDialogOpen(true);
  };

  const confirmAction = () => {
    startTransition(async () => {
      let result;

      if (dialogAction === "markPaid") {
        result = await updateOrderPaymentStatus(order.id, true);
      } else if (dialogAction === "markDelivered") {
        result = await updateOrderDeliveryStatus(order.id, true);
      }

      if (result && !result.success) {
        toast.error(result.message);
        setDialogOpen(false);
        return;
      }

      if (result) {
        toast.success(result.message);
      }
      setDialogOpen(false);
    });
  };

  // If both paid and delivered, no actions needed
  if (order.isPaid && order.isDelivered) {
    return null;
  }

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="sm" disabled={isPending}>
            {isPending ? (
              <Loader className="h-4 w-4 animate-spin" />
            ) : (
              <MoreVertical className="h-4 w-4" />
            )}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          {!order.isPaid && (
            <DropdownMenuItem onClick={() => handleAction("markPaid")}>
              <DollarSign className="mr-2 h-4 w-4" />
              Mark as Paid
            </DropdownMenuItem>
          )}
          {!order.isDelivered && (
            <DropdownMenuItem onClick={() => handleAction("markDelivered")}>
              <Truck className="mr-2 h-4 w-4" />
              Mark as Delivered
            </DropdownMenuItem>
          )}
        </DropdownMenuContent>
      </DropdownMenu>

      <AlertDialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              {dialogAction === "markPaid" && (
                <>
                  This will mark the order as paid and set the payment date to
                  now. This action can be reversed if needed.
                </>
              )}
              {dialogAction === "markDelivered" && (
                <>
                  This will mark the order as delivered and set the delivery
                  date to now. Make sure the order is paid before marking it as
                  delivered.
                </>
              )}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isPending}>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmAction} disabled={isPending}>
              {isPending ? (
                <>
                  <Loader className="mr-2 h-4 w-4 animate-spin" />
                  Processing...
                </>
              ) : (
                "Confirm"
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
