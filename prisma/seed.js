import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const defaultCategories = [
  { id: 1, name: "Groceries" },
  { id: 2, name: "Entertainment" },
  { id: 3, name: "Transportation" },
  { id: 4, name: "Shopping" },
  { id: 5, name: "Food & Drinks" },
  { id: 6, name: "Fitness" },
  { id: 7, name: "Insurance" },
  { id: 8, name: "Other" },
];

async function main() {
  for (const cat of defaultCategories) {
    await prisma.category.upsert({
      where: { id: cat.id },
      update: { name: cat.name },
      create: { id: cat.id, name: cat.name },
    });
  }
  // Optional: reset AUTO_INCREMENT to continue after seeded IDs (MySQL)
  const maxId = Math.max(...defaultCategories.map((c) => c.id));
  await prisma.$executeRawUnsafe(`ALTER TABLE Category AUTO_INCREMENT = ${maxId + 1}`);
}

main()
  .then(async () => {
    console.log("Seed completed: default categories upserted");
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });


