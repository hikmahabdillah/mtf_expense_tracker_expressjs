// transactions.routes.js
import express from "express";
import {
  createTransaction,
  updateTransaction,
  deleteTransaction,
  getBalance,
  getAllTransactions,
  getRecentTransactions,
} from "./transactions.controller.js";

const router = express.Router();

router.get("/", getAllTransactions);
router.get("/recent-transactions", getRecentTransactions);
router.get("/balance", getBalance);
router.post("/", createTransaction);
router.put("/:id", updateTransaction);
router.delete("/:id", deleteTransaction);

export default router;
