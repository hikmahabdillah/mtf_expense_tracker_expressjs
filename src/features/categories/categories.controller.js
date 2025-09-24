import validator from "validator";
import { ok, created, error } from "../../core/utils/response.js";
import {
  getAllCategories,
  getCategoryById,
  createCategory,
  updateCategory,
  deleteCategory,
} from "./category.model.js";

export const listCategories = async (req, res) => {
  try {
    const page = Math.max(1, parseInt(req.query.page || "1", 10));
    const limit = Math.min(100, Math.max(1, parseInt(req.query.limit || "100", 10)));
    const skip = (page - 1) * limit;

    const categories = await getAllCategories({ skip, take: limit });
    return ok(res, { data: categories, message: "Categories fetched", meta: { page, limit } });
  } catch (error) {
    return error(res, { status: error.statusCode || 500, message: error.message || "Failed to fetch categories" });
  }
};

export const getCategory = async (req, res) => {
  try {
    const id = Number(req.params.id);
    if (!Number.isInteger(id) || id <= 0) {
      return res.status(400).json({ success: false, message: "Invalid category id" });
    }
    const category = await getCategoryById(id);
    if (!category) return error(res, { status: 404, message: "Category not found" });
    return ok(res, { data: category, message: "Category fetched" });
  } catch (error) {
    return error(res, { status: error.statusCode || 500, message: error.message || "Failed to fetch category" });
  }
};

export const createCategoryController = async (req, res) => {
  try {
    const rawName = (req.body?.name || "").trim();
    if (!rawName) return error(res, { status: 400, message: "Name is required" });
    const name = validator.escape(rawName);
    const created = await createCategory(name);
    return created(res, { data: created, message: "Category created" });
  } catch (error) {
    return error(res, { status: error.statusCode || 500, message: error.message || "Failed to create category" });
  }
};

export const updateCategoryController = async (req, res) => {
  try {
    const id = Number(req.params.id);
    if (!Number.isInteger(id) || id <= 0) {
      return error(res, { status: 400, message: "Invalid category id" });
    }
    const rawName = (req.body?.name || "").trim();
    if (!rawName) return error(res, { status: 400, message: "Name is required" });
    const name = validator.escape(rawName);
    const updated = await updateCategory(id, name);
    if (!updated) return error(res, { status: 404, message: "Category not found" });
    return ok(res, { data: updated, message: "Category updated" });
  } catch (error) {
    return error(res, { status: error.statusCode || 500, message: error.message || "Failed to update category" });
  }
};

export const deleteCategoryController = async (req, res) => {
  try {
    const id = Number(req.params.id);
    if (!Number.isInteger(id) || id <= 0) {
      return error(res, { status: 400, message: "Invalid category id" });
    }
    const deleted = await deleteCategory(id);
    if (deleted === null) return error(res, { status: 404, message: "Category not found" });
    return ok(res, { message: "Category deleted" });
  } catch (error) {
    return error(res, { status: error.statusCode || 500, message: error.message || "Failed to delete category" });
  }
};


