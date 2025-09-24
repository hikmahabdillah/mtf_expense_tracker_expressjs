// transactions.routes.js
import express from "express";
import {
  getTransactions,
  createTransaction,
  deleteTransaction,
  getBalance,
} from "./transactions.controller.js";

const router = express.Router();

router.get("/", getTransactions);
router.get("/balance", getBalance);
router.post("/", createTransaction);
router.delete("/:id", deleteTransaction);

export default router;
