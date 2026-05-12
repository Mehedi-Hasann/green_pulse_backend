import { Router } from "express";
import { validateRequest } from "../../middleware/validateRequest";
import { AdminControllers } from "./admin.controller";
import { AdminValidations } from "./admin.validate";

const router: Router = Router();

router.get("/", AdminControllers.getAllAdmins);//ok

router.get("/:id", AdminControllers.getAdminById);//ok
router.patch(
  "/:id",
  validateRequest(AdminValidations.updateAdminSchema),
  AdminControllers.updateAdmin
);//ok
router.delete("/:id", AdminControllers.deleteAdmin);//ok

export const AdminRoutes = router;
