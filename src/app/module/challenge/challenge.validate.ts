import { z } from "zod";
import { ChallengeStatus } from "../../../generated/prisma";

const createChallengeSchema = z.object({
  categoryId: z.string("Category ID is required" ),
  title: z.string("Title is required").min(3, "Title must be at least 3 characters"),
  description: z.string("Description is required" ).min(10, "Description must be at least 10 characters"),
  duration: z.number("Duration is required" ).int().positive("Duration must be a positive integer"),
  pointsPerDay: z.number("Points per day is required" ).int().positive(),
  isPaid: z.boolean().optional().default(false).optional(),
  price: z.number().positive("Price must be a positive number").optional(),
  status: z.enum([ChallengeStatus.UPCOMING, ChallengeStatus.ACTIVE, ChallengeStatus.COMPLETED, ChallengeStatus.CANCELLED]).optional(),
});

const updateChallengeSchema = z.object({
  categoryId: z.string().optional(),
  title: z.string().min(3, "Title must be at least 3 characters").optional(),
  description: z.string().min(10, "Description must be at least 10 characters").optional(),
  duration: z.number().int().positive().optional(),
  pointsPerDay: z.number().int().positive().optional(),
  isPaid: z.boolean().optional(),
  price: z.number().positive().optional(),
  status: z.enum(["UPCOMING", "ACTIVE", "COMPLETED", "CANCELLED"]).optional(),
});

export const ChallengeValidations = {
  createChallengeSchema,
  updateChallengeSchema,
};
