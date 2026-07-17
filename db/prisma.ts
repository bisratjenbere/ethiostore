import { PrismaClient } from "@/lib/generated/prisma/client";
import { PrismaNeon } from "@prisma/adapter-neon";
import dotenv from "dotenv";

dotenv.config();

// ✅ VERIFIED NEON CONNECTION POOLING:
// DATABASE_URL already uses -pooler endpoint (verified in .env)
// PrismaNeon adapter handles connection pooling automatically
const adapter = new PrismaNeon({
  connectionString: process.env.DATABASE_URL as string,
});

// Global singleton pattern for development hot-reload
const globalForPrisma = global as unknown as { 
  prisma: ReturnType<typeof createPrismaClient> 
};

function createPrismaClient() {
  return new PrismaClient({
    adapter,
    // Log queries in development for debugging
    log:
      process.env.NODE_ENV === "development"
        ? ["query", "error", "warn"]
        : ["error"],
  }).$extends({
    result: {
      product: {
        price: {
          compute(product) {
            return product.price.toString();
          },
        },
        rating: {
          compute(product) {
            return product.rating.toString();
          },
        },
      },
    },
  });
}

export const prisma = globalForPrisma.prisma || createPrismaClient();

// Preserve Prisma instance in development to prevent hot-reload issues
if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}
