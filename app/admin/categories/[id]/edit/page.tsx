import { Metadata } from "next";
import { notFound } from "next/navigation";
import CategoryForm from "@/components/admin/categories/category-form";
import { getCategoryById } from "@/lib/actions/category.actions";

export const metadata: Metadata = {
  title: "Edit Category",
};

export default async function EditCategoryPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  let category;
  try {
    category = await getCategoryById(id);
  } catch (error) {
    notFound();
  }

  // Convert null to undefined for form compatibility
  const formCategory = {
    id: category.id,
    name: category.name,
    slug: category.slug,
    description: category.description ?? undefined,
    image: category.image ?? undefined,
    isActive: category.isActive,
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Edit Category</h1>
        <p className="text-muted-foreground mt-1">
          Update category information
        </p>
      </div>

      <CategoryForm type="update" category={formCategory} />
    </div>
  );
}
