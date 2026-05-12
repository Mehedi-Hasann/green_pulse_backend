import status from "http-status";
import { Role, UserStatus } from "../../../generated/prisma";
import AppError from "../../errorHelpers/AppError";
import { prisma } from "../../lib/prisma";

const getAllAdminsFromDB = async () => {
  const result = await prisma.admin.findMany();
  return result;
};

const getAdminByIdFromDB = async (id: string) => {
  const result = await prisma.admin.findUnique({
    where: {
      id
    }
  });
  return result;
};

const updateAdminInDB = async (id: string, payload: any) => {

  const adminData = await prisma.admin.findUnique({
    where: { id }
  });

  if (!adminData) {
    throw new AppError(status.NOT_FOUND, "Admin does not exist.");
  }

  const result = await prisma.$transaction(async (tx) => {

    // update user table
    await tx.user.update({
      where: {
        id: adminData.userId
      },
      data: {
        name: payload.name,
        image: payload.profilePhoto
      }
    });

    // update admin table
    const updatedAdmin = await tx.admin.update({
      where: {
        id
      },
      data: payload
    });

    return updatedAdmin;
  });

  return result;
};

const deleteAdminFromDB = async (id: string) => {
  const result = await prisma.$transaction(async (tx) => {
    const admin = await tx.admin.findUnique({
      where : {
        id
      }
    })
    console.log(admin)
    if(!admin){
      throw new AppError(status.NOT_FOUND, "Admin is not Exists");
    }
    const user = await tx.user.findUnique({
      where: {
        id : admin.userId
      },
    });

    if (!user) {
      throw new AppError(status.NOT_FOUND, "Admin not found");
    }

    await tx.user.update({
      where: {
        id: admin.userId,
      },
      data: {
        isDeleted: true,
        status : UserStatus.DELETED
      },
    });
    await tx.admin.delete({
      where : {
        id
      }
    })

    return user;
  });
  return result;
};

export const AdminServices = {
  getAllAdminsFromDB,
  getAdminByIdFromDB,
  updateAdminInDB,
  deleteAdminFromDB,
};
