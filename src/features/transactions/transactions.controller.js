import { prisma } from "../../core/config/db.js";

// transactions.controller.js
export const getTransactions = (req, res) => {
  // Get transactions logic here
  res.send("Get transactions endpoint");
};

export const createTransaction = (req, res) => {
  // Create transaction logic here
  res.send("Create transaction endpoint");
};

export const deleteTransaction = (req, res) => {
  // Delete transaction logic here
  res.send("Delete transaction endpoint");
};

export const getBalance = async (req, res) => {
  // const user = req.user;
  const expense = await prisma.transaction.aggregate({
    where: { type: "EXPENSE", userId: 1 },
    _sum: { amount: true },
  });
  const income = await prisma.transaction.aggregate({
    where: { type: "INCOME", userId: 1 },
    _sum: { amount: true },
  });

  const balance = (income._sum.amount || 0) - (expense._sum.amount || 0);
  res.json({
    balance,
    income: income._sum.amount || 0,
    expense: expense._sum.amount || 0,
  });
};
