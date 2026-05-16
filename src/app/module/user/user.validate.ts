import { z } from "zod";
import { UserStatus, Role, Gender } from "../../../generated/prisma";

const updateUserSchema = z.object({
  email: z.email().optional(),
  role: z.enum(Object.values(Role) as [string, ...string[]]).optional(),
  status: z.enum(Object.values(UserStatus) as [string, ...string[]]).optional(),
  isDeleted: z.boolean().optional(),
  name: z.string().optional(),
  profileImage: z.string().optional(),
  phoneNumber: z.string().optional(),
  gender: z.enum(Object.values(Gender) as [string, ...string[]]).optional(),
});

const updateProfileSchema = z.object({
  name: z.string().optional(),
  phoneNumber: z.string().optional(),
  address: z.string().optional(),
  gender: z.enum(Object.values(Gender) as [string, ...string[]]).optional(),
  profileImage: z.string().optional(),
});

export const UserValidations = {
  updateUserSchema,
  updateProfileSchema,
};
