"use server";
import { prisma } from "@/db/prisma";
import { Prisma } from "@/lib/generated/prisma/client";
import { convertToPlainObject } from "../utils";
import { LATEST_PRODUCT_LIMIT } from "../constants";

// Types for search and filtering
export type SortField = "price" | "name" | "createdAt" | "rating";
export type SortOrder = "asc" | "desc";

export interface SearchProductsParams {
  query?: string;
  category?: string;
  brand?: string;
  minPrice?: string;
  maxPrice?: string;
  inStock?: boolean;
  sortBy?: SortField;
  order?: SortOrder;
  page?: number;
  limit?: number;
}

export interface CategoryCount {
  category: string;
  count: number;
}

export interface BrandCount {
  brand: string;
  count: number;
}

//get latest products
export async function getLatestProducts() {
  const data = await prisma.product.findMany({
    take: LATEST_PRODUCT_LIMIT,
    orderBy: {
      createdAt: "desc",
    },
  });
  return convertToPlainObject(data);
}

export async function getProductBySlug(slug: string) {
  return await prisma.product.findFirst({
    where: { slug: slug },
  });
}

// Main search and filter function
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
      limit = 12,
    } = params;

    // Build where clause
    const whereConditions: Prisma.ProductWhereInput[] = [];

    // Search query across multiple fields
    if (query && query.trim()) {
      whereConditions.push({
        OR: [
          { name: { contains: query.trim(), mode: "insensitive" } },
          { description: { contains: query.trim(), mode: "insensitive" } },
          { brand: { contains: query.trim(), mode: "insensitive" } },
        ],
      });
    }

    // Category filter
    if (category && category !== "all") {
      whereConditions.push({ category });
    }

    // Brand filter
    if (brand && brand !== "all") {
      whereConditions.push({ brand });
    }

    // Price range filter
    if (minPrice || maxPrice) {
      const priceFilter: Prisma.DecimalFilter = {};
      if (minPrice) {
        priceFilter.gte = minPrice;
      }
      if (maxPrice) {
        priceFilter.lte = maxPrice;
      }
      whereConditions.push({ price: priceFilter });
    }

    // Stock filter
    if (inStock) {
      whereConditions.push({ stock: { gt: 0 } });
    }

    // Combine all conditions with AND
    const where: Prisma.ProductWhereInput =
      whereConditions.length > 0 ? { AND: whereConditions } : {};

    // Build orderBy
    const orderBy: Prisma.ProductOrderByWithRelationInput = {
      [sortBy]: order,
    };

    // Calculate pagination
    const skip = (page - 1) * limit;

    // Execute queries in parallel for better performance
    const [products, total, categories, brands] = await Promise.all([
      // Get products
      prisma.product.findMany({
        where,
        orderBy,
        skip,
        take: limit,
      }),

      // Get total count
      prisma.product.count({ where }),

      // Get categories with counts (for filter UI)
      prisma.product.groupBy({
        by: ["category"],
        _count: { category: true },
        orderBy: { category: "asc" },
      }),

      // Get brands with counts (for filter UI)
      prisma.product.groupBy({
        by: ["brand"],
        _count: { brand: true },
        orderBy: { brand: "asc" },
      }),
    ]);

    // Format results
    const formattedProducts = products.map((product) =>
      convertToPlainObject({
        ...product,
        price: product.price.toString(),
        rating: product.rating.toString(),
        images: Array.isArray(product.images)
          ? product.images.filter(
              (img): img is string => typeof img === "string" && img.length > 0
            )
          : [],
      })
    );

    const formattedCategories: CategoryCount[] = categories.map((c) => ({
      category: c.category,
      count: c._count.category,
    }));

    const formattedBrands: BrandCount[] = brands.map((b) => ({
      brand: b.brand,
      count: b._count.brand,
    }));

    return {
      success: true,
      data: {
        products: formattedProducts,
        total,
        pages: Math.ceil(total / limit),
        currentPage: page,
        categories: formattedCategories,
        brands: formattedBrands,
      },
    };
  } catch (error) {
    return {
      success: false,
      message: error instanceof Error ? error.message : "Search failed",
      data: {
        products: [],
        total: 0,
        pages: 0,
        currentPage: 1,
        categories: [],
        brands: [],
      },
    };
  }
}

// Get all categories with counts
export async function getAllCategories() {
  try {
    const categories = await prisma.product.groupBy({
      by: ["category"],
      _count: { category: true },
      orderBy: { category: "asc" },
    });

    return categories.map((c) => ({
      name: c.category,
      count: c._count.category,
    }));
  } catch (error) {
    return [];
  }
}

// Get all brands with counts
export async function getAllBrands() {
  try {
    const brands = await prisma.product.groupBy({
      by: ["brand"],
      _count: { brand: true },
      orderBy: { brand: "asc" },
    });

    return brands.map((b) => ({
      name: b.brand,
      count: b._count.brand,
    }));
  } catch (error) {
    return [];
  }
}

// Get price range distribution
export async function getPriceRanges() {
  try {
    const prices = await prisma.product.aggregate({
      _min: { price: true },
      _max: { price: true },
    });

    return {
      min: Number(prices._min.price || 0),
      max: Number(prices._max.price || 0),
    };
  } catch (error) {
    return { min: 0, max: 0 };
  }
}
