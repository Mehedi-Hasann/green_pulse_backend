import { Router } from "express";
import { UserControllers } from "./user.controller";
import { checkAuth } from "../../middleware/checkAuth";
import { Role } from "../../../generated/prisma";
import { validateRequest } from "../../middleware/validateRequest";
import { UserValidations } from "./user.validate";
import { multerUpload } from "../../../config/multer.config";

const router: Router = Router();

router.get("/", checkAuth(Role.ADMIN, Role.SUPER_ADMIN), UserControllers.getAllUsers);
router.get("/:id", checkAuth(Role.ADMIN, Role.SUPER_ADMIN, Role.MEMBER), UserControllers.getUserById);
router.patch(
  "/:id",
  multerUpload.single("file"),
  checkAuth(Role.MEMBER),
  validateRequest(UserValidations.updateUserSchema),
  UserControllers.updateUserByMember
);
router.delete("/:id", checkAuth(Role.ADMIN, Role.SUPER_ADMIN), UserControllers.deleteUser); 

export const UserRoutes = router;

