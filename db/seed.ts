import sampleData from "./sample-data";
import { prisma } from "@/db/prisma";

const main = async () => {
  await prisma.product.deleteMany();
  await prisma.user.deleteMany();
  await prisma.account.deleteMany();
  await prisma.session.deleteMany();
  await prisma.verificationToken.deleteMany();
  await prisma.product.createMany({
    data: sampleData.products,
  });
  await prisma.user.createMany({
    data: sampleData.users,
  });

  console.log("Database has been seeded successfully.");
};

main();
