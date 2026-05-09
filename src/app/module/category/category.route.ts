import { Router } from "express";
import { CategoryController } from "./category.controller";

const router: Router = Router();

router.post("/", CategoryController.createCategory);
// router.get("/", CategoryController.createCategory);
// router.delete("/", CategoryController.createCategory);

export const CategoryRoutes = router;