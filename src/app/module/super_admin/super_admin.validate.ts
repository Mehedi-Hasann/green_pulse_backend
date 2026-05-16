import { z } from "zod";
import { Gender, Role, UserStatus, SubmissionStatus, ChallengeStatus } from "../../../generated/prisma";

const updateAdminSchema = z.object({
  name: z.string().optional(),
  profilePhoto: z.string().optional(),
  phone: z.string().optional(),
  gender: z.enum(Gender).optional(),
});

const updateMemberSchema = z.object({
  name: z.string().optional(),
  profilePhoto: z.string().optional(),
  contactNumber: z.string().optional(),
  gender: z.enum(Gender).optional(),
  isDeleted: z.boolean().optional(),
});

const updateUserStatusSchema = z.object({
  status: z.enum(UserStatus,"Status is required"),
});

const updateUserRoleSchema = z.object({
  role: z.enum(Role,"Role is required" ),
});

const createChallengeSchema = z.object({
  categoryId: z.string("Category ID is required"),
  title: z.string("Title is required"),
  description: z.string("Description is required" ),
  duration: z.number("Duration is required" ).int().positive(),
  pointsPerDay: z.number("Points per day is required" ).int().nonnegative(),
  isPaid: z.boolean().optional(),
  price: z.number().optional(),
  status: z.enum(ChallengeStatus).optional(),
});

const updateChallengeSchema = createChallengeSchema.partial();

const createCategorySchema = z.object({
  name: z.string("Name is required" ),
  description: z.string("Description is required"),
  isActive: z.boolean().optional(),
});

const updateCategorySchema = createCategorySchema.partial();

const updateSubmissionStatusSchema = z.object({
  status: z.enum(SubmissionStatus,"Status is required" ),
});

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

export const SuperAdminValidations = {
  updateAdminSchema,
  updateMemberSchema,
  updateUserStatusSchema,
  updateUserRoleSchema,
  createChallengeSchema,
  updateChallengeSchema,
  createCategorySchema,
  updateCategorySchema,
  updateSubmissionStatusSchema,
  updateUserSchema
};
