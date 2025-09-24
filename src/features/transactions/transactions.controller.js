import {
  createTransactionModel,
  updateTransactionModel,
  deleteTransactionModel,
  findTransactionById,
  findAllTransactionsByUser,
  findRecentTransactionsByUser,
  getUserTransactionSum,
} from "./transaction.model.js";

// CREATE Transaction
export const createTransaction = async (req, res) => {
  try {
    const { type, amount, description, date, receipt, userId, categoryId } =
      req.body;
    if (!type || !amount || !description || !date || !userId || !categoryId) {
      return res.status(400).json({
        success: false,
        message: "Missing required fields",
      });
    }
    const transaction = await createTransactionModel({
      type,
      amount,
      description,
      date: new Date(date),
      receipt,
      userId,
      categoryId,
    });
    return res.status(201).json({
      success: true,
      message: "Transaction created successfully",
      data: transaction,
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: "Failed to create transaction",
      error: error?.message || error,
    });
  }
};

// UPDATE Transaction
export const updateTransaction = async (req, res) => {
  try {
    const { id } = req.params;
    const { type, amount, description, date, receipt, categoryId } = req.body;
    if (!id) {
      return res.status(400).json({
        success: false,
        message: "Transaction ID is required",
      });
    }

    const exist = await findTransactionById(id);
    if (!exist) {
      return res.status(404).json({
        success: false,
        message: "Transaction not found",
      });
    }

    const transaction = await updateTransactionModel(id, {
      type,
      amount,
      description,
      date: date ? new Date(date) : undefined,
      receipt,
      categoryId,
    });
    return res.json({
      success: true,
      message: "Transaction updated successfully",
      data: transaction,
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: "Failed to update transaction",
      error: error?.message || error,
    });
  }
};

// DELETE Transaction
export const deleteTransaction = async (req, res) => {
  try {
    const { id } = req.params;
    if (!id) {
      return res.status(400).json({
        success: false,
        message: "Transaction ID is required",
      });
    }

    const exist = await findTransactionById(id);
    if (!exist) {
      return res.status(404).json({
        success: false,
        message: "Transaction not found",
      });
    }

    await deleteTransactionModel(id);
    return res.json({
      success: true,
      message: "Transaction deleted successfully",
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: "Failed to delete transaction",
      error: error?.message || error,
    });
  }
};

// GET All Transactions
export const getAllTransactions = async (req, res) => {
  try {
    // userId bisa diambil dari req.user jika sudah ada auth
    const userId = 1;
    const transactions = await findAllTransactionsByUser(userId);
    return res.json({
      success: true,
      message: "All transactions fetched successfully",
      data: transactions,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to fetch transactions",
      error: error?.message || error,
    });
  }
};

// GET Recent Transactions
export const getRecentTransactions = async (req, res) => {
  try {
    const userId = 1;
    const transactions = await findRecentTransactionsByUser(userId, 6);
    return res.json({
      success: true,
      message: "Recent transactions fetched successfully",
      data: transactions,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to fetch recent transactions",
      error: error?.message || error,
    });
  }
};

// GET Balance
export const getBalance = async (req, res) => {
  try {
    const userId = 1;
    const expense = await getUserTransactionSum(userId, "EXPENSE");
    const income = await getUserTransactionSum(userId, "INCOME");

    const balance = (income._sum.amount || 0) - (expense._sum.amount || 0);
    return res.json({
      success: true,
      message: "Balance fetched successfully",
      data: {
        balance,
        income: income._sum.amount || 0,
        expense: expense._sum.amount || 0,
      },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to fetch balance",
      error: error?.message || error,
    });
  }
};
