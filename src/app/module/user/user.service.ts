import { UserStatus } from "../../../generated/prisma";
import { prisma } from "../../lib/prisma";

const getAllUsersFromDB = async () => {
  const result = await prisma.user.findMany({
    where: {
      isDeleted: false,
    },
  });
  return result;
};

const getUserByIdFromDB = async (id: string) => {
  const result = await prisma.user.findUnique({
    where: {
      id,
      isDeleted: false,
    },
  });
  return result;
};

const updateUserInDB = async (id: string, payload: any) => {
  const result = await prisma.user.update({
    where: {
      id,
      isDeleted: false,
    },
    data: payload,
  });
  return result;
};

const deleteUserFromDB = async (id: string) => {
  const result = await prisma.user.update({
    where: {
      id,
    },
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
