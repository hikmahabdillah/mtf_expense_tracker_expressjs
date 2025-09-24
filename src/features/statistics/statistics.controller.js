import { prisma } from "../../core/config/db.js";
import { ok, error } from "../../core/utils/response.js";

const getMonthName = (month) =>
  ["January","February","March","April","May","June","July","August","September","October","November","December"][month - 1];

const parseDateOrDefault = (value, def) => {
  const d = value ? new Date(value) : def;
  return isNaN(d.getTime()) ? def : d;
};

export const expensesByCategory = async (req, res) => {
  try {
    const userId = Number(req.query.userId);
    if (!Number.isInteger(userId) || userId <= 0) {
      return res.status(400).json({ success: false, message: "userId is required and must be a positive integer" });
    }
    const now = new Date();
    const defaultStart = new Date(now.getFullYear(), now.getMonth(), 1);
    const defaultEnd = new Date(now.getFullYear(), now.getMonth() + 1, 0);

    const typeParam = (req.query.type || "EXPENSE").toUpperCase();
    const typeFilter = typeParam === "ALL" ? undefined : typeParam;
    const startDate = parseDateOrDefault(req.query.startDate, defaultStart);
    const endDate = parseDateOrDefault(req.query.endDate, defaultEnd);

    const where = {
      userId,
      date: { gte: startDate, lte: endDate },
      ...(typeFilter ? { type: typeFilter } : {}),
    };

    const grouped = await prisma.transaction.groupBy({
      by: ["categoryId"],
      where,
      _sum: { amount: true },
      _count: { _all: true },
    });

    const categoryIds = grouped.map((g) => g.categoryId);
    const categories = await prisma.category.findMany({ where: { id: { in: categoryIds } } });
    const idToName = new Map(categories.map((c) => [c.id, c.name]));

    const totalAmount = grouped.reduce((sum, g) => sum + Number(g._sum.amount || 0), 0);

    const data = grouped.map((g) => {
      const total = Number(g._sum.amount || 0);
      const count = g._count._all || 0;
      const avg = count ? total / count : 0;
      const percentage = totalAmount ? (total / totalAmount) * 100 : 0;
      return {
        categoryId: g.categoryId,
        categoryName: idToName.get(g.categoryId) || "Unknown",
        totalAmount: Number(total.toFixed(2)),
        transactionCount: count,
        percentage: Number(percentage.toFixed(2)),
        averagePerTransaction: Number(avg.toFixed(2)),
      };
    }).sort((a, b) => b.totalAmount - a.totalAmount);

    const summary = {
      totalExpenses: Number(totalAmount.toFixed(2)),
      totalCategories: data.length,
      highestCategory: data[0]?.categoryName || null,
      lowestCategory: data[data.length - 1]?.categoryName || null,
    };

    return ok(res, { data, message: "Expenses by category", meta: { summary } });
  } catch (error) {
    return error(res, { status: 500, message: error.message || "Failed to compute statistics" });
  }
};

export const monthlyChart = async (req, res) => {
  try {
    const userId = Number(req.query.userId);
    if (!Number.isInteger(userId) || userId <= 0) {
      return res.status(400).json({ success: false, message: "userId is required and must be a positive integer" });
    }
    const now = new Date();
    const year = parseInt(req.query.year || String(now.getFullYear()), 10);
    const months = Math.min(12, Math.max(1, parseInt(req.query.months || "12", 10)));

    const results = [];
    for (let m = 1; m <= months; m += 1) {
      const monthIndex = m - 1; // 0-based
      const start = new Date(year, monthIndex, 1);
      const end = new Date(year, monthIndex + 1, 0);

      const [incomeAgg, expenseAgg, incomeCount, expenseCount] = await Promise.all([
        prisma.transaction.aggregate({ where: { userId, type: "INCOME", date: { gte: start, lte: end } }, _sum: { amount: true } }),
        prisma.transaction.aggregate({ where: { userId, type: "EXPENSE", date: { gte: start, lte: end } }, _sum: { amount: true } }),
        prisma.transaction.count({ where: { userId, type: "INCOME", date: { gte: start, lte: end } } }),
        prisma.transaction.count({ where: { userId, type: "EXPENSE", date: { gte: start, lte: end } } }),
      ]);

      const income = Number(incomeAgg._sum.amount || 0);
      const expenses = Number(expenseAgg._sum.amount || 0);
      const balance = income - expenses;

      results.push({
        month: m,
        monthName: getMonthName(m),
        year,
        income: Number(income.toFixed(2)),
        expenses: Number(expenses.toFixed(2)),
        balance: Number(balance.toFixed(2)),
        transactionCount: { income: incomeCount, expenses: expenseCount },
      });
    }

    const totalIncome = results.reduce((s, r) => s + r.income, 0);
    const totalExpenses = results.reduce((s, r) => s + r.expenses, 0);
    const summary = {
      totalIncome: Number(totalIncome.toFixed(2)),
      totalExpenses: Number(totalExpenses.toFixed(2)),
      netBalance: Number((totalIncome - totalExpenses).toFixed(2)),
      averageMonthlyIncome: Number((totalIncome / months).toFixed(2)),
      averageMonthlyExpenses: Number((totalExpenses / months).toFixed(2)),
    };

    return ok(res, { data: results, message: "Monthly chart", meta: { summary } });
  } catch (error) {
    return error(res, { status: 500, message: error.message || "Failed to compute monthly chart" });
  }
};


