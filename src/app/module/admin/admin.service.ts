
import status from "http-status";
import { Prisma, Role, UserStatus } from "../../../generated/prisma";
import AppError from "../../errorHelpers/AppError";
import { prisma } from "../../lib/prisma";

type UpdateUserFromAdminPayload = {
  name?: string;
  email?: string;
  role?: string;
  status?: string;
};

const normalizeRole = (role?: string): Role | undefined => {
  if (!role) return undefined;
  const normalized = role.trim().replace(/\s+/g, "_").toUpperCase();
  return Object.values(Role).includes(normalized as Role) ? (normalized as Role) : undefined;
};

const normalizeStatus = (statusValue?: string): UserStatus | undefined => {
  if (!statusValue) return undefined;
  const normalized = statusValue.trim().replace(/\s+/g, "_").toUpperCase();
  return Object.values(UserStatus).includes(normalized as UserStatus)
    ? (normalized as UserStatus)
    : undefined;
};

const updateUserByAdmin = async (userId: string, payload: UpdateUserFromAdminPayload) => {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: {
      member: true,
      admin: true,
      superAdmin: true,
    },
  });
  console.log(userId)

  if (!user) {
    throw new AppError(status.NOT_FOUND, "User is not exists");
  }

  const newRole = normalizeRole(payload.role) ?? user.role;
  const newStatus = normalizeStatus(payload.status) ?? user.status;

  const updateData: Prisma.UserUpdateInput = {};
  if (payload.name !== undefined) updateData.name = payload.name;
  if (payload.email !== undefined) updateData.email = payload.email;
  if (payload.role !== undefined) updateData.role = newRole;
  if (payload.status !== undefined) {
    updateData.status = newStatus;
    if (newStatus === UserStatus.DELETED) {
      updateData.isDeleted = true;
    }
  }

  await prisma.$transaction(async (tx) => {
    if (user.role === Role.ADMIN && newRole === Role.MEMBER) {
      if (!user.admin?.id) {
        throw new AppError(status.BAD_REQUEST, "Admin profile not found for user");
      }

      await tx.admin.delete({ where: { id: user.admin.id } });
      await tx.member.create({
        data: {
          userId: user.id,
          name: payload.name ?? user.name,
          profilePhoto: user.admin?.profilePhoto ?? user.image ?? null,
          contactNumber: user.admin?.phone ?? null,
          gender: user.admin?.gender ?? null,
        },
      });
    } else if (user.role === Role.MEMBER && newRole === Role.ADMIN) {
      if (!user.member?.id) {
        throw new AppError(status.BAD_REQUEST, "Member profile not found for user");
      }

      await tx.member.delete({ where: { id: user.member.id } });
      await tx.admin.create({
        data: {
          userId: user.id,
          name: payload.name ?? user.name,
          email: payload.email ?? user.email,
          profilePhoto: user.member?.profilePhoto ?? user.image ?? null,
          phone: user.member?.contactNumber ?? null,
          gender: user.member?.gender ?? null,
        },
      });
    } else if (newRole === Role.ADMIN && user.admin) {
      const adminData: Prisma.AdminUpdateInput = {};
      if (payload.name !== undefined) adminData.name = payload.name;
      if (payload.email !== undefined) adminData.email = payload.email;
      if (Object.keys(adminData).length > 0) {
        await tx.admin.update({ where: { id: user.admin.id }, data: adminData });
      }
    } else if (newRole === Role.MEMBER && user.member) {
      const memberData: Prisma.MemberUpdateInput = {};
      if (payload.name !== undefined) memberData.name = payload.name;
      if (Object.keys(memberData).length > 0) {
        await tx.member.update({ where: { id: user.member.id }, data: memberData });
      }
    }

    await tx.user.update({ where: { id: userId }, data: updateData });
  });

  return prisma.user.findUnique({
    where: { id: userId },
    include: { member: true, admin: true, superAdmin: true },
  });
};

export const AdminServices = {
  updateUserByAdmin,
};
