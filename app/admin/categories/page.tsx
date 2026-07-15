import { Metadata } from "next";
import Link from "next/link";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getAllCategories } from "@/lib/actions/category.actions";
import AdminCategoriesTable from "@/components/admin/categories/admin-categories-table";

export const metadata: Metadata = {
  title: "Admin Categories",
};

export default async function AdminCategoriesPage() {
  const categories = await getAllCategories();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Categories</h1>
          <p className="text-muted-foreground mt-1">
            Manage product categories
          </p>
        </div>
        <Button asChild>
          <Link href="/admin/categories/new">
            <Plus className="h-4 w-4 mr-2" />
            Add Category
          </Link>
        </Button>
      </div>

      <AdminCategoriesTable data={categories} />
    </div>
  );
}
