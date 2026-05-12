import status from "http-status";
import { UserStatus } from "../../../generated/prisma";
import AppError from "../../errorHelpers/AppError";
import { prisma } from "../../lib/prisma";

const getAllUsersFromDB = async () => {
  const result = await prisma.user.findMany({
    where: {
      isDeleted: false,
    },
    orderBy: { createdAt: "desc" },
  });
  return result;
};

const getUserByIdFromDB = async (id: string) => {
  const user = await prisma.user.findUnique({
    where: {
      id,
      isDeleted: false,
    },
  });

  if (!user) {
    throw new AppError(status.NOT_FOUND, "User not found");
  }

  return user;
};

const updateUserInDB = async (id: string, payload: any) => {
  const existing = await prisma.user.findUnique({
    where: { id },
  });

  if (!existing) {
    throw new AppError(status.NOT_FOUND, "User not found");
  }

  if (existing.isDeleted) {
    throw new AppError(status.GONE, "User account has been deleted");
  }

  if (existing.status === UserStatus.BLOCKED) {
    throw new AppError(status.FORBIDDEN, "User account is blocked");
  }

  const result = await prisma.user.update({
    where: { id },
    data: payload,
  });

  return result;
};

const deleteUserFromDB = async (id: string) => {
  const existing = await prisma.user.findUnique({
    where: { id },
  });

  if (!existing) {
    throw new AppError(status.NOT_FOUND, "User not found");
  }

  if (existing.isDeleted) {
    throw new AppError(status.GONE, "User is already deleted");
  }

  const result = await prisma.user.update({
    where: { id },
    data: {
      isDeleted: true,
      status: UserStatus.DELETED,
    },
  });

  return result;
};

export const UserServices = {
  getAllUsersFromDB,
  getUserByIdFromDB,
  updateUserInDB,
  deleteUserFromDB,
};

