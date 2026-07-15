"use client";

import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Edit, Trash2, ToggleLeft, ToggleRight } from "lucide-react";
import { useTransition } from "react";
import { toast } from "sonner";
import {
  deleteCategory,
  toggleCategoryStatus,
} from "@/lib/actions/category.actions";
import { useRouter } from "next/navigation";

interface Category {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  isActive: boolean;
  productCount: number;
  createdAt: Date;
}

export default function AdminCategoriesTable({
  data,
}: {
  data: Category[];
}) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const handleToggleStatus = (id: string) => {
    startTransition(async () => {
      const res = await toggleCategoryStatus(id);
      if (res.success) {
        toast.success(res.message);
        router.refresh();
      } else {
        toast.error(res.message);
      }
    });
  };

  const handleDelete = (id: string, name: string) => {
    if (
      !confirm(`Are you sure you want to delete category "${name}"?`)
    ) {
      return;
    }

    startTransition(async () => {
      const res = await deleteCategory(id);
      if (res.success) {
        toast.success(res.message);
        router.refresh();
      } else {
        toast.error(res.message);
      }
    });
  };

  if (data.length === 0) {
    return (
      <div className="text-center py-12 border rounded-lg">
        <p className="text-muted-foreground">No categories found</p>
      </div>
    );
  }

  return (
    <div className="border rounded-lg">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Slug</TableHead>
            <TableHead>Description</TableHead>
            <TableHead>Products</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Created</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((category) => (
            <TableRow key={category.id}>
              <TableCell className="font-medium">{category.name}</TableCell>
              <TableCell className="text-muted-foreground">
                {category.slug}
              </TableCell>
              <TableCell className="max-w-xs truncate">
                {category.description || "—"}
              </TableCell>
              <TableCell>
                <Badge variant="secondary">{category.productCount}</Badge>
              </TableCell>
              <TableCell>
                <Badge
                  variant={category.isActive ? "default" : "secondary"}
                >
                  {category.isActive ? "Active" : "Inactive"}
                </Badge>
              </TableCell>
              <TableCell className="text-muted-foreground">
                {new Date(category.createdAt).toLocaleDateString()}
              </TableCell>
              <TableCell className="text-right">
                <div className="flex items-center justify-end gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleToggleStatus(category.id)}
                    disabled={isPending}
                  >
                    {category.isActive ? (
                      <ToggleRight className="h-4 w-4" />
                    ) : (
                      <ToggleLeft className="h-4 w-4" />
                    )}
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    asChild
                  >
                    <Link href={`/admin/categories/${category.id}/edit`}>
                      <Edit className="h-4 w-4" />
                    </Link>
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDelete(category.id, category.name)}
                    disabled={isPending || category.productCount > 0}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
