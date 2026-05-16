import { Router } from "express";
import { CategoryRoutes } from "../module/category/category.route";
import { AuthRoutes } from "../module/auth/auth.route";
import { UserRoutes } from "../module/user/user.route";
import { MemberRoutes } from "../module/member/member.route";
import { ChallengeRoutes } from "../module/challenge/challenge.route";
import { MemberChallengeRoutes } from "../module/member-challenge/member-challenge.route";
import { AdminRoutes } from "../module/admin/admin.route";
import { SuperAdminRoutes } from "../module/super_admin/super_admin.route";
import { SubmissionRoutes } from "../module/submission/submission.route";

const router: Router = Router();

const moduleRoutes = [
  { path: "/auth", route: AuthRoutes },
  { path: "/member", route: MemberRoutes },
  { path: "/category", route: CategoryRoutes },
  { path: "/challenge", route: ChallengeRoutes },
  { path: "/users", route: UserRoutes },
  { path: "/admin", route: AdminRoutes },
  { path: "/member-challenge", route: MemberChallengeRoutes },
  { path: "/super-admin", route: SuperAdminRoutes },
  { path: "/submissions", route: SubmissionRoutes },
];

moduleRoutes.forEach((route) => router.use(route.path, route.route));

export const IndexRoutes = router;
