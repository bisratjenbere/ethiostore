"use server";

import { auth } from "@/auth";
import { prisma } from "@/db/prisma";
import { revalidatePath } from "next/cache";
import { formatError, convertToPlainObject } from "../utils";
import { insertProductSchema } from "../validators";
import { z } from "zod";
import { sendShippingNotificationEmail } from "@/lib/email/actions/email.actions";

// Type definitions
type OrderFilters = {
  page?: number;
  limit?: number;
  isPaid?: boolean | string;
  isDelivered?: boolean | string;
  search?: string;
};

type ProductFilters = {
  page?: number;
  limit?: number;
  category?: string;
  brand?: string;
  inStock?: boolean | string;
  search?: string;
};


export async function getAllOrders(filters: OrderFilters = {}) {
  try {
    const session = await auth();
    if (session?.user?.role !== "admin") {
      throw new Error("Unauthorized - Admin access required");
    }

    const page = Number(filters.page) || 1;
    const limit = Number(filters.limit) || 20;
    const skip = (page - 1) * limit;

    // Build where clause
    const where: any = {};

    if (filters.isPaid !== undefined && filters.isPaid !== "all") {
      where.isPaid = filters.isPaid === "true" || filters.isPaid === true;
    }

    if (filters.isDelivered !== undefined && filters.isDelivered !== "all") {
      where.isDelivered =
        filters.isDelivered === "true" || filters.isDelivered === true;
    }

    if (filters.search) {
      where.OR = [
        { user: { email: { contains: filters.search, mode: "insensitive" } } },
        { user: { name: { contains: filters.search, mode: "insensitive" } } },
      ];
    }

    // Fetch orders and total count in parallel
    const [orders, total] = await Promise.all([
      prisma.order.findMany({
        where,
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
          orderItems: {
            include: {
              product: {
                select: {
                  id: true,
                  name: true,
                  slug: true,
                },
              },
            },
          },
        },
        orderBy: { createdAt: "desc" },
        skip,
        take: limit,
      }),
      prisma.order.count({ where }),
    ]);

    // Convert to plain objects and format decimals
    const formattedOrders = orders.map((order) =>
      convertToPlainObject({
        ...order,
        itemsPrice: order.itemsPrice.toString(),
        shippingPrice: order.shippingPrice.toString(),
        taxPrice: order.taxPrice.toString(),
        totalPrice: order.totalPrice.toString(),
        orderItems: order.orderItems.map((item) => ({
          ...item,
          price: item.price.toString(),
        })),
      })
    );

    return {
      success: true,
      data: {
        orders: formattedOrders,
        total,
        pages: Math.ceil(total / limit),
        currentPage: page,
      },
    };
  } catch (error) {
    return {
      success: false,
      message: formatError(error),
    };
  }
}

// Update order payment status (Task 7.1)
export async function updateOrderPaymentStatus(
  orderId: string,
  isPaid: boolean
) {
  try {
    const session = await auth();
    if (session?.user?.role !== "admin") {
      throw new Error("Unauthorized - Admin access required");
    }

    // Check if order exists
    const order = await prisma.order.findUnique({
      where: { id: orderId },
    });

    if (!order) {
      throw new Error("Order not found");
    }

    // Update order
    await prisma.order.update({
      where: { id: orderId },
      data: {
        isPaid,
        paidAt: isPaid ? new Date() : null,
      },
    });

    revalidatePath("/admin/orders");
    revalidatePath(`/admin/orders/${orderId}`);

    return {
      success: true,
      message: `Order marked as ${isPaid ? "paid" : "unpaid"}`,
    };
  } catch (error) {
    return {
      success: false,
      message: formatError(error),
    };
  }
}

// Update order delivery status (Task 7.2)
export async function updateOrderDeliveryStatus(
  orderId: string,
  isDelivered: boolean
) {
  try {
    const session = await auth();
    if (session?.user?.role !== "admin") {
      throw new Error("Unauthorized - Admin access required");
    }

    // Fetch order to check payment status
    const order = await prisma.order.findUnique({
      where: { id: orderId },
    });

    if (!order) {
      throw new Error("Order not found");
    }

    // Validate: Cannot deliver unpaid order
    if (isDelivered && !order.isPaid) {
      throw new Error("Cannot mark unpaid order as delivered");
    }

    // Update order
    await prisma.order.update({
      where: { id: orderId },
      data: {
        isDelivered,
        deliveredAt: isDelivered ? new Date() : undefined,
      },
    });

    revalidatePath("/admin/orders");
    revalidatePath(`/admin/orders/${orderId}`);

    // Send shipping notification email if delivered (async, don't wait)
    if (isDelivered) {
      sendShippingNotificationEmail(orderId).catch(err => {
        console.error('Error sending shipping notification email:', err);
      });
    }

    return {
      success: true,
      message: `Order marked as ${isDelivered ? "delivered" : "pending delivery"}`,
    };
  } catch (error) {
    return {
      success: false,
      message: formatError(error),
    };
  }
}


// ============================================
// PRODUCT MANAGEMENT ACTIONS (Task 12)
// ============================================

// Get all products with filtering and pagination (Task 12.1)
export async function getAllProducts(filters: ProductFilters = {}) {
  try {
    const session = await auth();
    if (session?.user?.role !== "admin") {
      throw new Error("Unauthorized - Admin access required");
    }

    const page = Number(filters.page) || 1;
    const limit = Number(filters.limit) || 20;
    const skip = (page - 1) * limit;

    // Build where clause
    const where: any = {};

    if (filters.category && filters.category !== "all") {
      where.category = filters.category;
    }

    if (filters.brand && filters.brand !== "all") {
      where.brand = filters.brand;
    }

    if (filters.inStock !== undefined && filters.inStock !== "all") {
      if (filters.inStock === "true" || filters.inStock === true) {
        where.stock = { gt: 0 };
      } else {
        where.stock = { lte: 0 };
      }
    }

    if (filters.search) {
      where.OR = [
        { name: { contains: filters.search, mode: "insensitive" } },
        { slug: { contains: filters.search, mode: "insensitive" } },
      ];
    }

    // Fetch products and total count in parallel
    const [products, total] = await Promise.all([
      prisma.product.findMany({
        where,
        orderBy: { createdAt: "desc" },
        skip,
        take: limit,
      }),
      prisma.product.count({ where }),
    ]);

    // Convert to plain objects and format decimals
    const formattedProducts = products.map((product) =>
      convertToPlainObject({
        ...product,
        price: product.price.toString(),
        rating: product.rating.toString(),
        images: Array.isArray(product.images) 
          ? product.images.filter((img): img is string => typeof img === 'string' && img.length > 0)
          : [],
      })
    );

    return {
      success: true,
      data: {
        products: formattedProducts,
        total,
        pages: Math.ceil(total / limit),
        currentPage: page,
      },
    };
  } catch (error) {
    return {
      success: false,
      message: formatError(error),
    };
  }
}

// Create new product (Task 12.2)
export async function createProduct(data: z.infer<typeof insertProductSchema>) {
  try {
    const session = await auth();
    if (session?.user?.role !== "admin") {
      throw new Error("Unauthorized - Admin access required");
    }

    // Validate input
    const validated = insertProductSchema.parse(data);

    // Check if slug already exists
    const existingProduct = await prisma.product.findUnique({
      where: { slug: validated.slug },
    });

    if (existingProduct) {
      throw new Error("Product with this slug already exists");
    }

    // Create product
    const product = await prisma.product.create({
      data: {
        ...validated,
        price: validated.price,
        rating: 0,
        numReviews: 0,
      },
    });

    revalidatePath("/admin/products");
    revalidatePath("/");

    return {
      success: true,
      message: "Product created successfully",
      data: { productId: product.id },
    };
  } catch (error) {
    return {
      success: false,
      message: formatError(error),
    };
  }
}

// Update product (Task 12.3)
export async function updateProduct(
  id: string,
  data: z.infer<typeof insertProductSchema>
) {
  try {
    const session = await auth();
    if (session?.user?.role !== "admin") {
      throw new Error("Unauthorized - Admin access required");
    }

    // Validate input
    const validated = insertProductSchema.parse(data);

    // Check if product exists
    const product = await prisma.product.findUnique({
      where: { id },
    });

    if (!product) {
      throw new Error("Product not found");
    }

    // Check if slug is being changed and if new slug already exists
    if (validated.slug !== product.slug) {
      const existingProduct = await prisma.product.findUnique({
        where: { slug: validated.slug },
      });

      if (existingProduct) {
        throw new Error("Product with this slug already exists");
      }
    }

    // Update product
    await prisma.product.update({
      where: { id },
      data: validated,
    });

    revalidatePath("/admin/products");
    revalidatePath(`/product/${validated.slug}`);
    revalidatePath("/");

    return {
      success: true,
      message: "Product updated successfully",
    };
  } catch (error) {
    return {
      success: false,
      message: formatError(error),
    };
  }
}

// Delete product (Task 12.4)
export async function deleteProduct(id: string) {
  try {
    const session = await auth();
    if (session?.user?.role !== "admin") {
      throw new Error("Unauthorized - Admin access required");
    }

    // Check if product exists
    const product = await prisma.product.findUnique({
      where: { id },
    });

    if (!product) {
      throw new Error("Product not found");
    }

    // Check if product is in any orders
    const orderItemCount = await prisma.orderItem.count({
      where: { productId: id },
    });

    if (orderItemCount > 0) {
      throw new Error(
        "Cannot delete product with existing orders. Consider marking it as inactive instead."
      );
    }

    // Delete product
    await prisma.product.delete({
      where: { id },
    });

    revalidatePath("/admin/products");
    revalidatePath("/");

    return {
      success: true,
      message: "Product deleted successfully",
    };
  } catch (error) {
    return {
      success: false,
      message: formatError(error),
    };
  }
}

// Get product by ID for editing
export async function getProductById(id: string) {
  try {
    const session = await auth();
    if (session?.user?.role !== "admin") {
      throw new Error("Unauthorized - Admin access required");
    }

    const product = await prisma.product.findUnique({
      where: { id },
    });

    if (!product) {
      throw new Error("Product not found");
    }

    return {
      success: true,
      data: convertToPlainObject({
        ...product,
        price: product.price.toString(),
        rating: product.rating.toString(),
      }),
    };
  } catch (error) {
    return {
      success: false,
      message: formatError(error),
    };
  }
}


// ============================================
// USER MANAGEMENT ACTIONS (Task 19)
// ============================================

type UserFilters = {
  page?: number;
  limit?: number;
  role?: "user" | "admin" | string;
  search?: string;
};

// Get all users with filtering and pagination (Task 19.1)
export async function getAllUsers(filters: UserFilters = {}) {
  try {
    const session = await auth();
    if (session?.user?.role !== "admin") {
      throw new Error("Unauthorized - Admin access required");
    }

    const page = Number(filters.page) || 1;
    const limit = Number(filters.limit) || 50;
    const skip = (page - 1) * limit;

    // Build where clause
    const where: any = {};

    if (filters.role && filters.role !== "all") {
      where.role = filters.role;
    }

    if (filters.search) {
      where.OR = [
        { name: { contains: filters.search, mode: "insensitive" } },
        { email: { contains: filters.search, mode: "insensitive" } },
      ];
    }

    // Fetch users and total count in parallel
    const [users, total] = await Promise.all([
      prisma.user.findMany({
        where,
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
          createdAt: true,
          updatedAt: true,
          image: true,
          _count: {
            select: {
              orders: true,
            },
          },
        },
        orderBy: { createdAt: "desc" },
        skip,
        take: limit,
      }),
      prisma.user.count({ where }),
    ]);

    return {
      success: true,
      data: {
        users: convertToPlainObject(users),
        total,
        pages: Math.ceil(total / limit),
        currentPage: page,
      },
    };
  } catch (error) {
    return {
      success: false,
      message: formatError(error),
    };
  }
}

// Get user details with order history (Task 19.2)
export async function getUserDetails(userId: string) {
  try {
    const session = await auth();
    if (session?.user?.role !== "admin") {
      throw new Error("Unauthorized - Admin access required");
    }

    // Fetch user with orders
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        image: true,
        address: true,
        paymentMethod: true,
        createdAt: true,
        updatedAt: true,
        orders: {
          include: {
            orderItems: true,
          },
          orderBy: {
            createdAt: "desc",
          },
        },
      },
    });

    if (!user) {
      throw new Error("User not found");
    }

    // Calculate total spent (sum of all paid orders)
    const totalSpent = user.orders
      .filter((order) => order.isPaid)
      .reduce((sum, order) => sum + Number(order.totalPrice), 0);

    // Format orders
    const formattedOrders = user.orders.map((order) => ({
      ...order,
      itemsPrice: order.itemsPrice.toString(),
      shippingPrice: order.shippingPrice.toString(),
      taxPrice: order.taxPrice.toString(),
      totalPrice: order.totalPrice.toString(),
      orderItems: order.orderItems.map((item) => ({
        ...item,
        price: item.price.toString(),
      })),
    }));

    return {
      success: true,
      data: convertToPlainObject({
        ...user,
        orders: formattedOrders,
        totalSpent: totalSpent.toFixed(2),
      }),
    };
  } catch (error) {
    return {
      success: false,
      message: formatError(error),
    };
  }
}

// Update user role (Task 19.3)
export async function updateUserRole(
  userId: string,
  role: "user" | "admin"
) {
  try {
    const session = await auth();
    if (session?.user?.role !== "admin") {
      throw new Error("Unauthorized - Admin access required");
    }

    // Prevent self-demotion
    if (session.user.id === userId && role === "user") {
      throw new Error("Cannot demote yourself from admin role");
    }

    // Check if user exists
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new Error("User not found");
    }

    // Update user role
    await prisma.user.update({
      where: { id: userId },
      data: { role },
    });

    revalidatePath("/admin/users");
    revalidatePath(`/admin/users/${userId}`);

    return {
      success: true,
      message: `User role updated to ${role}`,
    };
  } catch (error) {
    return {
      success: false,
      message: formatError(error),
    };
  }
}


// ============================================
// DASHBOARD & ANALYTICS ACTIONS (Task 24)
// ============================================

// Get dashboard metrics (Task 24)
export async function getDashboardMetrics() {
  try {
    const session = await auth();
    if (session?.user?.role !== "admin") {
      throw new Error("Unauthorized - Admin access required");
    }

    // Get today's date range
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    // Fetch all metrics in parallel for performance
    const [
      totalRevenueResult,
      totalOrders,
      totalProducts,
      totalUsers,
      ordersTodayCount,
      revenueTodayResult,
      recentOrders,
    ] = await Promise.all([
      // Total revenue (sum of all paid orders)
      prisma.order.aggregate({
        where: { isPaid: true },
        _sum: { totalPrice: true },
      }),
      // Total orders count
      prisma.order.count(),
      // Total products count
      prisma.product.count(),
      // Total users count
      prisma.user.count(),
      // Orders today count
      prisma.order.count({
        where: {
          createdAt: {
            gte: today,
            lt: tomorrow,
          },
        },
      }),
      // Revenue today (sum of paid orders created today)
      prisma.order.aggregate({
        where: {
          isPaid: true,
          createdAt: {
            gte: today,
            lt: tomorrow,
          },
        },
        _sum: { totalPrice: true },
      }),
      // Recent orders (last 5)
      prisma.order.findMany({
        take: 5,
        orderBy: { createdAt: "desc" },
        include: {
          user: {
            select: {
              name: true,
              email: true,
            },
          },
        },
      }),
    ]);

    // Calculate pending orders (not paid)
    const pendingOrdersCount = await prisma.order.count({
      where: { isPaid: false },
    });

    // Convert Decimal to string for client
    const totalRevenue = totalRevenueResult._sum.totalPrice
      ? Number(totalRevenueResult._sum.totalPrice)
      : 0;
    const revenueToday = revenueTodayResult._sum.totalPrice
      ? Number(revenueTodayResult._sum.totalPrice)
      : 0;

    // Format recent orders
    const formattedRecentOrders = recentOrders.map((order) => ({
      ...order,
      itemsPrice: order.itemsPrice.toString(),
      shippingPrice: order.shippingPrice.toString(),
      taxPrice: order.taxPrice.toString(),
      totalPrice: order.totalPrice.toString(),
    }));

    return {
      success: true,
      data: {
        totalRevenue: totalRevenue.toFixed(2),
        totalOrders,
        totalProducts,
        totalUsers,
        ordersToday: ordersTodayCount,
        revenueToday: revenueToday.toFixed(2),
        pendingOrders: pendingOrdersCount,
        recentOrders: convertToPlainObject(formattedRecentOrders),
      },
    };
  } catch (error) {
    return {
      success: false,
      message: formatError(error),
    };
  }
}
