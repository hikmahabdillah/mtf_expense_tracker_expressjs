// db.js (Prisma MySQL connection)
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export const connectDB = async () => {
  try {
    await prisma.$connect();
    console.log("MySQL (Prisma) connected");
  } catch (err) {
    console.error("MySQL (Prisma) connection error:", err);
    process.exit(1);
  }
};

export { prisma };
