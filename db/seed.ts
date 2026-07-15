import sampleData from "./sample-data";
import { sampleCategories } from "./category-data";
import { prisma } from "@/db/prisma";

const main = async () => {
  // Delete existing data
  await prisma.review.deleteMany();
  await prisma.orderItem.deleteMany();
  await prisma.order.deleteMany();
  await prisma.product.deleteMany();
  await prisma.category.deleteMany();
  await prisma.cart.deleteMany();
  await prisma.account.deleteMany();
  await prisma.session.deleteMany();
  await prisma.verificationToken.deleteMany();
  await prisma.user.deleteMany();

  // Seed categories
  console.log("Seeding categories...");
  await prisma.category.createMany({
    data: sampleCategories,
  });
  console.log(`✅ Seeded ${sampleCategories.length} categories`);

  // Seed users
  console.log("Seeding users...");
  await prisma.user.createMany({
    data: sampleData.users,
  });
  console.log(`✅ Seeded ${sampleData.users.length} users`);

  // Seed products
  console.log("Seeding products...");
  await prisma.product.createMany({
    data: sampleData.products,
  });
  console.log(`✅ Seeded ${sampleData.products.length} products`);

  console.log("\n✅ Database has been seeded successfully!");
};

main()
  .catch((error) => {
    console.error("Error seeding database:", error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
