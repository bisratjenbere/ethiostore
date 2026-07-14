"use client";

import { useTransition, useState } from "react";
import { useRouter } from "next/navigation";
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
import { Trash2, Loader } from "lucide-react";
import { toast } from "sonner";
import { deleteProduct } from "@/lib/actions/admin.actions";

type Product = {
  id: string;
  name: string;
};

export default function ProductActions({ product }: { product: Product }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [dialogOpen, setDialogOpen] = useState(false);

  const handleDelete = () => {
    startTransition(async () => {
      const result = await deleteProduct(product.id);

      if (!result.success) {
        toast.error(result.message);
        setDialogOpen(false);
        return;
      }

      toast.success(result.message);
      setDialogOpen(false);
      router.refresh();
    });
  };

  return (
    <>
      <Button
        variant="destructive"
        size="sm"
        onClick={() => setDialogOpen(true)}
        disabled={isPending}
      >
        {isPending ? (
          <Loader className="h-4 w-4 animate-spin" />
        ) : (
          <Trash2 className="h-4 w-4" />
        )}
      </Button>

      <AlertDialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete <strong>{product.name}</strong>.
              This action cannot be undone.
              <br />
              <br />
              <span className="text-destructive">
                Note: Products that are in existing orders cannot be deleted.
              </span>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isPending}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              disabled={isPending}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {isPending ? (
                <>
                  <Loader className="mr-2 h-4 w-4 animate-spin" />
                  Deleting...
                </>
              ) : (
                "Delete Product"
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
