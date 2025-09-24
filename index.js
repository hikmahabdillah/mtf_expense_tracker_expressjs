import "dotenv/config";
import express from "express";
import { connectDB } from "./src/core/config/db.js";
import authRoutes from "./src/features/auth/auth.routes.js";
import transactionRoutes from "./src/features/transactions/transactions.routes.js";
import categoriesRouter from "./src/features/categories/categories.routes.js";
import statisticsRouter from "./src/features/statistics/statistics.routes.js";

const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/transactions", transactionRoutes);
app.use("/api/categories", categoriesRouter);
app.use("/api/statistics", statisticsRouter);

connectDB()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error(
      "Failed to connect to the database. Server is not running.",
      err
    );
    process.exit(1);
  });
