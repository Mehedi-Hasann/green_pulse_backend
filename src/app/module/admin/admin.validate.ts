import { z } from "zod";

const createAdminSchema = z.object({
  name: z.string("Name is required" ),
  email: z.email("Invalid email"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  profilePhoto: z.string().optional(),
  phone: z.string().optional(),
  gender: z.enum(["MALE", "FEMALE", "OTHER"]).optional(),
});

const updateAdminSchema = z.object({
  name: z.string().optional(),
  profilePhoto: z.string().optional(),
  phone: z.string().optional(),
  gender: z.enum(["MALE", "FEMALE", "OTHER"]).optional(),
});

export const AdminValidations = {
  createAdminSchema,
  updateAdminSchema,
};
