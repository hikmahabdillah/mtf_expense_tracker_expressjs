import { prisma } from "../../core/config/db.js";

// Get all categories with transaction counts
export const getAllCategories = async ({ skip = 0, take = 100 } = {}) => {
  try {
    const categories = await prisma.category.findMany({
      skip,
      take,
      orderBy: { name: "asc" },
      include: {
        _count: { select: { transactions: true } },
      },
    });

    return categories.map((c) => ({
      id: c.id,
      name: c.name,
      transactionCount: c._count.transactions,
    }));
  } catch (error) {
    throw error;
  }
};

// Get single category with transaction count
export const getCategoryById = async (id) => {
  try {
    const category = await prisma.category.findUnique({
      where: { id: Number(id) },
      include: { _count: { select: { transactions: true } } },
    });
    if (!category) return null;
    return {
      id: category.id,
      name: category.name,
      transactionCount: category._count.transactions,
    };
  } catch (error) {
    throw error;
  }
};

// Create category with duplicate validation
export const createCategory = async (name) => {
  try {
    const exists = await prisma.category.findUnique({ where: { name } });
    if (exists) {
      const err = new Error("Category name already exists");
      err.statusCode = 409;
      throw err;
    }
    const category = await prisma.category.create({ data: { name } });
    return { id: category.id, name: category.name, transactionCount: 0 };
  } catch (error) {
    throw error;
  }
};

// Update category name with duplicate validation
export const updateCategory = async (id, name) => {
  try {
    const existing = await prisma.category.findUnique({ where: { id: Number(id) } });
    if (!existing) return null;

    if (name && name !== existing.name) {
      const dup = await prisma.category.findUnique({ where: { name } });
      if (dup) {
        const err = new Error("Category name already exists");
        err.statusCode = 409;
        throw err;
      }
    }

    const updated = await prisma.category.update({ where: { id: Number(id) }, data: { name } });
    const count = await prisma.transaction.count({ where: { categoryId: updated.id } });
    return { id: updated.id, name: updated.name, transactionCount: count };
  } catch (error) {
    throw error;
  }
};

// Delete category with validation for existing transactions
export const deleteCategory = async (id) => {
  try {
    const categoryId = Number(id);
    const exists = await prisma.category.findUnique({ where: { id: categoryId } });
    if (!exists) return null;

    const txCount = await prisma.transaction.count({ where: { categoryId } });
    if (txCount > 0) {
      const err = new Error("Cannot delete category with existing transactions");
      err.statusCode = 400;
      throw err;
    }

    await prisma.category.delete({ where: { id: categoryId } });
    return true;
  } catch (error) {
    throw error;
  }
};


