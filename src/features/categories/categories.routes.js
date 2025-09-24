import express from "express";
import {
  listCategories,
  getCategory,
  createCategoryController,
  updateCategoryController,
  deleteCategoryController,
} from "./categories.controller.js";

const router = express.Router();

router.get("/", listCategories);
router.get("/:id", getCategory);
router.post("/", createCategoryController);
router.put("/:id", updateCategoryController);
router.delete("/:id", deleteCategoryController);

export default router;


