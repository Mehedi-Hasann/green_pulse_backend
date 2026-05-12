import { Router } from "express";
import { validateRequest } from "../../middleware/validateRequest";
import { AdminControllers } from "./admin.controller";
import { AdminValidations } from "./admin.validate";

const router: Router = Router();

router.get("/", AdminControllers.getAllAdmins);

router.get("/:id", AdminControllers.getAdminById);
router.patch(
  "/:id",
  validateRequest(AdminValidations.updateAdminSchema),
  AdminControllers.updateAdmin
);
router.delete("/:id", AdminControllers.deleteAdmin);

export const AdminRoutes = router;
