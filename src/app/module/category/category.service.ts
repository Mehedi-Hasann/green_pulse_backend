import { Category } from "../../../generated/prisma/client";
import { prisma } from "../../lib/prisma";

const createCategory = async(payload : Category) : Promise<Category> => {
  const specialty = await prisma.category.create({
    data : payload
  })

  return specialty;
}

export const CategoryService = {
  createCategory
}