import { Router } from "express";
import { CategoryRoutes } from "../module/category/category.route";
import { AuthRoutes } from "../module/auth/auth.route";
import { UserRoutes } from "../module/user/user.route";
import { AdminRoutes } from "../module/admin/admin.route";
import { MemberRoutes } from "../module/member/member.route";



const router: Router = Router();

router.use("/auth",AuthRoutes);
router.use("/admin",AdminRoutes);
router.use("/member",MemberRoutes);
router.use("/category", CategoryRoutes);
router.use("/users", UserRoutes);



export const IndexRoutes = router