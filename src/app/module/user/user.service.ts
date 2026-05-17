
import status from "http-status";
import { Role, UserStatus } from "../../../generated/prisma";
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

const getUserByIdFromDB = async (memberId: string) => {
 
  const member = await prisma.member.findUnique({
    where : {
      id : memberId
    }
  })
  if(!member){
    throw new AppError(status.NOT_FOUND, "Member not found");
  }
  const user = await prisma.user.findUnique({
    where: {
      id : member?.userId,
      isDeleted: false,
    },
    include : {
      member : true,
      admin : true,
      superAdmin : true
    }
  });

  if (!user) {
    throw new AppError(status.NOT_FOUND, "User not found");
  }
  // console.log(user)

  return user;
};

const updateUserByMember = async (
  id: string,
  payload: Record<string, unknown>,
  currentUser?: { userId: string; role: Role; email: string }
) => {
  if (!currentUser || currentUser.role !== Role.MEMBER) {
    throw new AppError(status.FORBIDDEN, "Only members can access this route");
  }

  if (id !== currentUser.userId) {
    throw new AppError(status.FORBIDDEN, "Members can only update their own profile");
  }

  const existing = await prisma.user.findUnique({
    where: { id },
    include: {
      member: true,
    },
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

  const allowedKeys = ["name", "profileImage"];
  const forbiddenKeys = Object.keys(payload).filter(
    (key) => !allowedKeys.includes(key)
  );

  if (forbiddenKeys.length > 0) {
    throw new AppError(
      status.FORBIDDEN,
      "Members can only update name and profileImage"
    );
  }

  const userData: Record<string, unknown> = { ...payload };

  if (payload.profileImage !== undefined) {
    userData.image = payload.profileImage;
    delete userData.profileImage;
  }

  const profileUpdate: Record<string, unknown> = {};
  if (payload.name !== undefined) {
    profileUpdate.name = payload.name;
  }
  if (payload.profileImage !== undefined) {
    profileUpdate.profilePhoto = payload.profileImage;
  }

  const relationUpdate: Record<string, unknown> = {};
  if (existing.member && Object.keys(profileUpdate).length > 0) {
    relationUpdate.member = { update: profileUpdate };
  }

  const result = await prisma.user.update({
    where: { id },
    data: {
      ...userData,
      ...relationUpdate,
    },
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
  updateUserByMember,
  deleteUserFromDB,
};

