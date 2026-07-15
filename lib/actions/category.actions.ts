"use server";

import { prisma } from "@/db/prisma";
import { auth } from "@/auth";
import { revalidatePath } from "next/cache";
import { formatError } from "../utils";
import { z } from "zod";

// Category schema
const categorySchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  slug: z.string().min(2, "Slug must be at least 2 characters"),
  description: z.string().optional(),
  image: z.string().optional(),
  isActive: z.boolean(),
});

export type CategoryInput = z.infer<typeof categorySchema>;

/**
 * Get all categories
 */
export async function getAllCategories() {
  try {
    const categories = await prisma.category.findMany({
      orderBy: { name: "asc" },
      include: {
        _count: {
          select: { products: true },
        },
      },
    });

    return categories.map((cat) => ({
      ...cat,
      productCount: cat._count.products,
    }));
  } catch (error) {
    const errorMessage = await formatError(error);
    throw new Error(errorMessage);
  }
}

/**
 * Get active categories only
 */
export async function getActiveCategories() {
  try {
    const categories = await prisma.category.findMany({
      where: { isActive: true },
      orderBy: { name: "asc" },
      select: {
        id: true,
        name: true,
        slug: true,
        description: true,
        image: true,
      },
    });

    return categories;
  } catch (error) {
    const errorMessage = await formatError(error);
    throw new Error(errorMessage);
  }
}

/**
 * Get category by ID
 */
export async function getCategoryById(id: string) {
  try {
    const category = await prisma.category.findUnique({
      where: { id },
      include: {
        _count: {
          select: { products: true },
        },
      },
    });

    if (!category) {
      throw new Error("Category not found");
    }

    return {
      ...category,
      productCount: category._count.products,
    };
  } catch (error) {
    const errorMessage = await formatError(error);
    throw new Error(errorMessage);
  }
}

/**
 * Create a new category (Admin only)
 */
export async function createCategory(data: CategoryInput) {
  try {
    const session = await auth();
    if (!session?.user || session.user.role !== "admin") {
      throw new Error("Unauthorized");
    }

    const validated = categorySchema.parse(data);

    const category = await prisma.category.create({
      data: validated,
    });

    revalidatePath("/admin/categories");
    revalidatePath("/shop");

    return {
      success: true,
      message: "Category created successfully",
      data: category,
    };
  } catch (error) {
    return {
      success: false,
      message: formatError(error),
    };
  }
}

/**
 * Update category (Admin only)
 */
export async function updateCategory(id: string, data: CategoryInput) {
  try {
    const session = await auth();
    if (!session?.user || session.user.role !== "admin") {
      throw new Error("Unauthorized");
    }

    const validated = categorySchema.parse(data);

    const category = await prisma.category.update({
      where: { id },
      data: validated,
    });

    revalidatePath("/admin/categories");
    revalidatePath(`/admin/categories/${id}`);
    revalidatePath("/shop");

    return {
      success: true,
      message: "Category updated successfully",
      data: category,
    };
  } catch (error) {
    return {
      success: false,
      message: formatError(error),
    };
  }
}

/**
 * Delete category (Admin only)
 * Note: Products with this category will have categoryId set to null
 */
export async function deleteCategory(id: string) {
  try {
    const session = await auth();
    if (!session?.user || session.user.role !== "admin") {
      throw new Error("Unauthorized");
    }

    // Check if category has products
    const category = await prisma.category.findUnique({
      where: { id },
      include: {
        _count: {
          select: { products: true },
        },
      },
    });

    if (!category) {
      throw new Error("Category not found");
    }

    if (category._count.products > 0) {
      throw new Error(
        `Cannot delete category with ${category._count.products} products. Please reassign or delete products first.`
      );
    }

    await prisma.category.delete({
      where: { id },
    });

    revalidatePath("/admin/categories");
    revalidatePath("/shop");

    return {
      success: true,
      message: "Category deleted successfully",
    };
  } catch (error) {
    return {
      success: false,
      message: formatError(error),
    };
  }
}

/**
 * Toggle category active status (Admin only)
 */
export async function toggleCategoryStatus(id: string) {
  try {
    const session = await auth();
    if (!session?.user || session.user.role !== "admin") {
      throw new Error("Unauthorized");
    }

    const category = await prisma.category.findUnique({
      where: { id },
    });

    if (!category) {
      throw new Error("Category not found");
    }

    const updated = await prisma.category.update({
      where: { id },
      data: { isActive: !category.isActive },
    });

    revalidatePath("/admin/categories");
    revalidatePath("/shop");

    return {
      success: true,
      message: `Category ${updated.isActive ? "activated" : "deactivated"} successfully`,
      data: updated,
    };
  } catch (error) {
    return {
      success: false,
      message: formatError(error),
    };
  }
}
