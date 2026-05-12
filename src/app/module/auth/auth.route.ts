import { Router } from "express";
import { AuthController } from "./auth.controller";
import { validateRequest } from "../../middleware/validateRequest";
import { registerUserZodSchema } from "./auth.validate";
import { checkAuth } from "../../middleware/checkAuth";
import { Role } from "../../../generated/prisma";
import { multerUpload } from "../../../config/multer.config";

const router : Router = Router();

router.post("/register",multerUpload.single("file") ,validateRequest(registerUserZodSchema) ,AuthController.registerMember);//ok
router.post("/login",AuthController.loginUser);//ok
router.post("/change-password",checkAuth(Role.MEMBER,Role.ADMIN,Role.SUPER_ADMIN), AuthController.changePassword);//ok
router.post("/logout", checkAuth(Role.MEMBER,Role.ADMIN,Role.SUPER_ADMIN), AuthController.logoutUser);//ok
router.post("/verify-email",AuthController.verifyEmail);//ok
router.post("/forget-password",AuthController.forgetPassword);//ok
router.post("/reset-password",AuthController.resetPassword);//ok

router.get("/login/google",AuthController.googleLogin);//ok
router.get("/google/success",AuthController.googleLoginSuccess);//ok
router.get("/oauth/error",AuthController.handlerOAuthError);//ok



export const AuthRoutes = router