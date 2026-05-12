import { Router } from "express";
import { validateRequest } from "../../middleware/validateRequest";
import { CategoryController } from "./category.controller";
import { CategoryValidations } from "./category.validate";

const router: Router = Router();

router.post(
  "/",
  validateRequest(CategoryValidations.createCategorySchema),
  CategoryController.createCategory
); //ok

router.get("/", CategoryController.getAllCategories); //ok
router.get("/:id", CategoryController.getCategoryById); //ok

router.patch(
  "/:id",
  validateRequest(CategoryValidations.updateCategorySchema),
  CategoryController.updateCategory
); //ok

router.delete("/:id", CategoryController.deleteCategory);//ok

export const CategoryRoutes = router;
