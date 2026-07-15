import { Metadata } from "next";
import CategoryForm from "@/components/admin/categories/category-form";

export const metadata: Metadata = {
  title: "Create Category",
};

export default function NewCategoryPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Create Category</h1>
        <p className="text-muted-foreground mt-1">
          Add a new product category
        </p>
      </div>

      <CategoryForm type="create" />
    </div>
  );
}
