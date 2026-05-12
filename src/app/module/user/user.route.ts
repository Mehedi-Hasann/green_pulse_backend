import { Router } from "express";
import { UserControllers } from "./user.controller";

const router: Router = Router();

router.get("/", UserControllers.getAllUsers);
router.get("/:id", UserControllers.getUserById);
router.patch("/:id", UserControllers.updateUser);
router.delete("/:id", UserControllers.deleteUser);

export const UserRoutes = router;
