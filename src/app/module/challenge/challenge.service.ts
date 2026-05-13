import status from "http-status";
import AppError from "../../errorHelpers/AppError";
import { prisma } from "../../lib/prisma";
import { ICreateChallengePayload, IUpdateChallengePayload } from "./challenge.interface";

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

const getAllChallengesFromDB = async () => {
  const result = await prisma.challenge.findMany({
    include: {
      category: true,
      _count: {
        select: { memberChallenges: true, submission: true },
      },
    },
    orderBy: { createdAt: "desc" },
  });
  return result;
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
