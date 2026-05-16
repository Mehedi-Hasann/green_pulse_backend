import { Router } from "express";
import { AdminController } from "./admin.controller";
import { checkAuth } from "../../middleware/checkAuth";
import { Role } from "../../../generated/prisma";

const router: Router = Router();

router.patch("/users/:id", checkAuth(Role.ADMIN, Role.SUPER_ADMIN), AdminController.updateUser);

export const AdminRoutes = router;
