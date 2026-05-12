import { Router } from "express";
import { CategoryRoutes } from "../module/category/category.route";
import { AuthRoutes } from "../module/auth/auth.route";
import { UserRoutes } from "../module/user/user.route";
import { AdminRoutes } from "../module/admin/admin.route";
import { MemberRoutes } from "../module/member/member.route";
import { ChallengeRoutes } from "../module/challenge/challenge.route";
import { MemberChallengeRoutes } from "../module/member-challenge/member-challenge.route";



const router: Router = Router();

router.use("/auth",AuthRoutes); //ok
router.use("/admin",AdminRoutes); //ok
router.use("/member",MemberRoutes); //ok
router.use("/category", CategoryRoutes); //ok
router.use("/challenge", ChallengeRoutes);  //ok
router.use("/users", UserRoutes); //ok
router.use("/member-challenge", MemberChallengeRoutes); //ok



export const IndexRoutes = router