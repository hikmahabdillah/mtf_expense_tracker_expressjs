import express from "express";
import { expensesByCategory, monthlyChart } from "./statistics.controller.js";

const router = express.Router();

router.get("/expenses-by-category", expensesByCategory);
router.get("/monthly-chart", monthlyChart);

export default router;


