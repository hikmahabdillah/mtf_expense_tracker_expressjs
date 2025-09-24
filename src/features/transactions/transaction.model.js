import { prisma } from "../../core/config/db.js";

// CREATE
export const createTransactionModel = (data) => {
  return prisma.transaction.create({ data });
};

// UPDATE
export const updateTransactionModel = (id, data) => {
  return prisma.transaction.update({
    where: { id: Number(id) },
    data,
  });
};

// DELETE
export const deleteTransactionModel = (id) => {
  return prisma.transaction.delete({
    where: { id: Number(id) },
  });
};

// FIND UNIQUE
export const findTransactionById = (id) => {
  return prisma.transaction.findUnique({
    where: { id: Number(id) },
  });
};

// FIND MANY (All)
export const findAllTransactionsByUser = (userId) => {
  return prisma.transaction.findMany({
    where: { userId: Number(userId) },
  });
};

// FIND RECENT
export const findRecentTransactionsByUser = (userId, take = 6) => {
  return prisma.transaction.findMany({
    where: { userId: Number(userId) },
    orderBy: { date: "desc" },
    take,
  });
};

// AGGREGATE BALANCE
export const getUserTransactionSum = (userId, type) => {
  return prisma.transaction.aggregate({
    where: { type, userId: Number(userId) },
    _sum: { amount: true },
  });
};
