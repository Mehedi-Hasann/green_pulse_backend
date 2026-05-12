import status from "http-status";
import AppError from "../../errorHelpers/AppError";
import { prisma } from "../../lib/prisma";

const createCategoryIntoDB = async (payload: { name: string; description: string }) => {
  const existing = await prisma.category.findFirst({
    where: { name: payload.name },
  });

  if (existing) {
    throw new AppError(status.CONFLICT, "Category with this name already exists");
  }

  const result = await prisma.category.create({
    data: payload,
  });

  return result;
};

const getAllCategoriesFromDB = async () => {
  const result = await prisma.category.findMany({
    where: {
      isActive: true,
    },
    include: {
      _count: {
        select: { challenge: true },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });
  return result;
};

const getCategoryByIdFromDB = async (id: string) => {
  const result = await prisma.category.findUnique({
    where: { id },
    include: {
      challenge: true,
    },
  });

  if (!result) {
    throw new AppError(status.NOT_FOUND, "Category not found");
  }

  return result;
};

const updateCategoryInDB = async (id: string, payload: { name?: string; description?: string; isActive?: boolean }) => {
  const existing = await prisma.category.findUnique({
    where: { id },
  });

  if (!existing) {
    throw new AppError(status.NOT_FOUND, "Category not found");
  }

  const result = await prisma.category.update({
    where: { id },
    data: payload,
  });

  return result;
};

const deleteCategoryFromDB = async (id: string) => {
  const existing = await prisma.category.findUnique({
    where: { id },
    include: {
      _count: { select: { challenge: true } },
    },
  });

  if (!existing) {
    throw new AppError(status.NOT_FOUND, "Category not found");
  }

  if (existing._count.challenge > 0) {
    throw new AppError(
      status.BAD_REQUEST,
      "Cannot delete category with existing challenges. Deactivate it instead."
    );
  }

  // Soft delete: set isActive to false
  const result = await prisma.category.update({
    where: { id },
    data: { isActive: false },
  });

  return result;
};

export const CategoryService = {
  createCategoryIntoDB,
  getAllCategoriesFromDB,
  getCategoryByIdFromDB,
  updateCategoryInDB,
  deleteCategoryFromDB,
};