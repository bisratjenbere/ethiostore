"use server";
import { prisma } from "@/db/prisma";
import { convertToPlainObject } from "../utils";
import { LATEST_PRODUCT_LIMIT } from "../constants";

export async function getLatestProducts() {
  const data = await prisma.product.findMany({
    take: LATEST_PRODUCT_LIMIT,
    orderBy: { createdAt: "desc" },
  });
  return convertToPlainObject(data);
}

export async function getProductBySlug(slug: string) {
  return await prisma.product.findFirst({ where: { slug } });
}

export type CategoryCount = { category: string; count: number };
export type BrandCount = { brand: string; count: number };

type SortBy = "createdAt" | "price" | "name" | "rating";
type SortOrder = "asc" | "desc";

interface SearchProductsParams {
  query?: string;
  category?: string;
  brand?: string;
  minPrice?: string;
  maxPrice?: string;
  inStock?: boolean;
  sortBy?: SortBy;
  order?: SortOrder;
  page?: number;
  limit?: number;
}

const PAGE_SIZE = 12;

export async function searchProducts(params: SearchProductsParams = {}) {
  try {
    const {
      query,
      category,
      brand,
      minPrice,
      maxPrice,
      inStock,
      sortBy = "createdAt",
      order = "desc",
      page = 1,
      limit = PAGE_SIZE,
    } = params;

    // Build where clause
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const where: any = { isActive: true };

    if (query) {
      where.OR = [
        { name: { contains: query, mode: "insensitive" } },
        { description: { contains: query, mode: "insensitive" } },
        { brand: { contains: query, mode: "insensitive" } },
      ];
    }
    if (category) where.category = { equals: category, mode: "insensitive" };
    if (brand) where.brand = { equals: brand, mode: "insensitive" };
    if (inStock) where.stock = { gt: 0 };
    if (minPrice || maxPrice) {
      where.price = {};
      if (minPrice) where.price.gte = parseFloat(minPrice);
      if (maxPrice) where.price.lte = parseFloat(maxPrice);
    }

    const orderBy =
      sortBy === "price"
        ? { price: order }
        : sortBy === "name"
        ? { name: order }
        : sortBy === "rating"
        ? { rating: order }
        : { createdAt: order };

    const [products, total, categoryGroups, brandGroups] = await Promise.all([
      prisma.product.findMany({
        where,
        orderBy,
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.product.count({ where }),
      prisma.product.groupBy({
        by: ["category"],
        _count: { category: true },
        orderBy: { _count: { category: "desc" } },
      }),
      prisma.product.groupBy({
        by: ["brand"],
        _count: { brand: true },
        orderBy: { _count: { brand: "desc" } },
      }),
    ]);

    const categories: CategoryCount[] = categoryGroups.map((g) => ({
      category: g.category,
      count: g._count.category,
    }));

    const brands: BrandCount[] = brandGroups.map((g) => ({
      brand: g.brand,
      count: g._count.brand,
    }));

    return {
      success: true,
      data: {
        products: convertToPlainObject(
          products.map((p) => ({ ...p, price: p.price.toString(), rating: p.rating.toString() }))
        ),
        total,
        pages: Math.ceil(total / limit),
        currentPage: page,
        categories,
        brands,
      },
    };
  } catch (error) {
    return {
      success: false,
      message: error instanceof Error ? error.message : "Failed to search products",
    };
  }
}
