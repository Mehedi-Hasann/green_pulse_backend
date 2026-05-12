import { Router } from "express";
import { AuthController } from "./auth.controller";
import { validateRequest } from "../../middleware/validateRequest";
import { registerUserZodSchema } from "./auth.validate";
import { checkAuth } from "../../middleware/checkAuth";
import { Role } from "../../../generated/prisma";
import { multerUpload } from "../../../config/multer.config";

const router : Router = Router();

router.post("/register",multerUpload.single("file") ,validateRequest(registerUserZodSchema) ,AuthController.registerMember);
router.post("/login",AuthController.loginUser);
router.post("/change-password",checkAuth(Role.MEMBER,Role.ADMIN,Role.SUPER_ADMIN), AuthController.changePassword);
router.post("/logout", checkAuth(Role.MEMBER,Role.ADMIN,Role.SUPER_ADMIN), AuthController.logoutUser);
router.post("/verify-email",AuthController.verifyEmail);
router.post("/forget-password",AuthController.forgetPassword);
router.post("/reset-password",AuthController.resetPassword);

router.get("/login/google",AuthController.googleLogin);
router.get("/google/success",AuthController.googleLoginSuccess);
router.get("/oauth/error",AuthController.handlerOAuthError);



export const AuthRoutes = router