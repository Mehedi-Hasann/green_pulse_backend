import { Router } from "express";
import { validateRequest } from "../../middleware/validateRequest";
import { CategoryController } from "./category.controller";
import { CategoryValidations } from "./category.validate";

const router: Router = Router();

router.post(
  "/",
  validateRequest(CategoryValidations.createCategorySchema),
  CategoryController.createCategory
); 

router.get("/", CategoryController.getAllCategories); 
router.get("/:id", CategoryController.getCategoryById); 

router.patch(
  "/:id",
  validateRequest(CategoryValidations.updateCategorySchema),
  CategoryController.updateCategory
); 

router.delete("/:id", CategoryController.deleteCategory);

export const CategoryRoutes = router;
