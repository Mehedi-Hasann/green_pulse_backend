import { Router } from "express";
import { CategoryRoutes } from "../module/category/category.route";
import { AuthRoutes } from "../module/auth/auth.route";


const router: Router = Router();

router.use("/auth",AuthRoutes);
router.use("/category", CategoryRoutes);


export const IndexRoutes = router