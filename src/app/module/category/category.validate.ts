import { z } from "zod";

const createCategorySchema = z.object({
  name: z.string("Name is required" ).min(2, "Name must be at least 2 characters"),
  description: z.string("Description is required" ).min(5, "Description must be at least 5 characters"),
});

const updateCategorySchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters").optional(),
  description: z.string().min(5, "Description must be at least 5 characters").optional(),
  isActive: z.boolean().optional(),
});

export const CategoryValidations = {
  createCategorySchema,
  updateCategorySchema,
};
