import { Router } from "express";
import { AuthController } from "./auth.controller";

const router : Router = Router();

router.post("/register",AuthController.registerMember);

export const AuthRoutes = router