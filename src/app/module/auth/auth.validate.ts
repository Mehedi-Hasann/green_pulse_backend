import z from "zod";
import { Role, UserStatus } from "../../../generated/prisma";

export const registerUserZodSchema = z.object({
  name : z.string("Name is required").min(1, "Name must be at least 1 characters").max(15, "Name must be at most 15 characters"),
  email : z.email("Invalid email address"),
  password : z.string("Invalid password").min(4, "Password must be greater or equal 4"),
  role : z.enum([Role.MEMBER,Role.ADMIN,Role.SUPER_ADMIN], "Role must be either Admin, Member, Super Admin").optional(),
  status : z.enum([UserStatus.ACTIVE,UserStatus.BLOCKED,UserStatus.DELETED], "UserStatus must be Active, Deleted or Blocked").optional(),
  image : z.string("Please provide a valid image").optional()
})