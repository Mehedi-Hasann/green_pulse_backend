import status from "http-status";
import AppError from "../../errorHelpers/AppError";
import { prisma } from "../../lib/prisma";
import { ICreateChallengePayload, IUpdateChallengePayload } from "./challenge.interface";
import { IQueryParams } from "../../interfaces/query.interface";
import { QueryBuilder } from "../../utils/QueryBuilder";

const createChallengeIntoDB = async (payload: ICreateChallengePayload) => {
  const existing = await prisma.challenge.findFirst({
    where: { title: payload.title },
  });

  if (existing) {
    throw new AppError(status.CONFLICT, "A challenge with this title already exists");
  }

  const category = await prisma.category.findUnique({
    where: { id: payload.categoryId },
  });

  if (!category) {
    throw new AppError(status.NOT_FOUND, "Category not found");
  }

  const result = await prisma.challenge.create({
    data: payload,
    include: { category: true },
  });

  return result;
};

const getAllChallengesFromDB = async (queryParams: IQueryParams = {}) => {
  const normalizedQuery: IQueryParams = { ...queryParams };

  if (typeof normalizedQuery.type === "string") {
    const typeValue = normalizedQuery.type.toLowerCase();

    if (typeValue === "paid") {
      normalizedQuery.isPaid = "true";
    } else if (typeValue === "free") {
      normalizedQuery.isPaid = "false";
    } else if (["upcoming", "active", "completed", "cancelled"].includes(typeValue)) {
      normalizedQuery.status = typeValue.toUpperCase();
    }

    delete normalizedQuery.type;
  }

  if (typeof normalizedQuery.sortBy === "string") {
    let sortBy = normalizedQuery.sortBy;
    let sortOrder: "asc" | "desc" = "desc";

    if (sortBy.startsWith("-")) {
      sortOrder = "desc";
      sortBy = sortBy.slice(1);
    } else if (sortBy.startsWith("+")) {
      sortOrder = "asc";
      sortBy = sortBy.slice(1);
    }

    switch (sortBy.toLowerCase()) {
      case "points-high":
        sortBy = "pointsPerDay";
        sortOrder = "desc";
        break;
      case "points-low":
        sortBy = "pointsPerDay";
        sortOrder = "asc";
        break;
      case "newest":
        sortBy = "createdAt";
        sortOrder = "desc";
        break;
      case "oldest":
        sortBy = "createdAt";
        sortOrder = "asc";
        break;
      case "points":
      case "pointsperday":
        sortBy = "pointsPerDay";
        break;
      case "createdat":
        sortBy = "createdAt";
        break;
      default:
        break;
    }

    normalizedQuery.sortBy = sortBy;
    normalizedQuery.sortOrder = sortOrder;
  }

  const challengeQueryBuilder = new QueryBuilder(prisma.challenge, normalizedQuery, {
    searchableFields: ["title", "description", "category.name"],
    filterableFields: ["categoryId", "status", "isPaid"],
  });

  return await challengeQueryBuilder
    .search()
    .filter()
    .sort()
    .paginate()
    .include({
      category: true,
      _count: {
        select: { memberChallenges: true, submission: true },
      },
    })
    .execute();
};

const getChallengeByIdFromDB = async (id: string) => {
  const result = await prisma.challenge.findUnique({
    where: { id },
    include: {
      category: true,
      _count: {
        select: { memberChallenges: true, submission: true },
      },
    },
  });

  if (!result) {
    throw new AppError(status.NOT_FOUND, "Challenge not found");
  }

  return result;
};

const updateChallengeInDB = async (id: string, payload: IUpdateChallengePayload) => {
  const existing = await prisma.challenge.findUnique({ where: { id } });

  if (!existing) {
    throw new AppError(status.NOT_FOUND, "Challenge not found");
  }

  const result = await prisma.challenge.update({
    where: { id },
    data: payload,
    include: { category: true },
  });

  return result;
};

const deleteChallengeFromDB = async (id: string) => {
  const existing = await prisma.challenge.findUnique({
    where: { id },
    include: {
      _count: { select: { memberChallenges: true } },
    },
  });

  if (!existing) {
    throw new AppError(status.NOT_FOUND, "Challenge not found");
  }

  // Soft delete by setting status to CANCELLED
  const result = await prisma.challenge.delete({
    where: { id }
  });

  return result;
};

export const ChallengeService = {
  createChallengeIntoDB,
  getAllChallengesFromDB,
  getChallengeByIdFromDB,
  updateChallengeInDB,
  deleteChallengeFromDB,
};
