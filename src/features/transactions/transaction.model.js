// transaction.model.js (Prisma)
// All transaction DB logic should use the Prisma client.
import { prisma } from "../../core/config/db.js";

// Example: createTransaction, getTransactions, deleteTransaction, etc.
// Implement your transaction DB functions here using Prisma.

export const createTransaction = async (data) =>
  await prisma.transaction.create({ data });
export const getTransactions = async (userId) =>
  await prisma.transaction.findMany({ where: { userId } });
export const deleteTransaction = async (id) =>
  await prisma.transaction.delete({ where: { id } });
