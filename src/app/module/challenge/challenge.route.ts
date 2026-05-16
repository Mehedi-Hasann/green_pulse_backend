import { Router } from "express";
import { validateRequest } from "../../middleware/validateRequest";
import { ChallengeController } from "./challenge.controller";
import { ChallengeValidations } from "./challenge.validate";
import { checkAuth } from "../../middleware/checkAuth";
import { Role } from "../../../generated/prisma";
import { multerUpload } from "../../../config/multer.config";

const router: Router = Router();

router.get("/", ChallengeController.getAllChallenges);
router.get("/:id", ChallengeController.getChallengeById);
router.post(
  "/",
  checkAuth(Role.ADMIN, Role.SUPER_ADMIN),
  multerUpload.single("file"),
  validateRequest(ChallengeValidations.createChallengeSchema),
  ChallengeController.createChallenge,
);

router.patch(
  "/:id",
  checkAuth(Role.ADMIN, Role.SUPER_ADMIN),
  validateRequest(ChallengeValidations.updateChallengeSchema),
  ChallengeController.updateChallenge
);

router.delete(
  "/:id", 
  checkAuth(Role.ADMIN, Role.SUPER_ADMIN),
  ChallengeController.deleteChallenge
);

export const ChallengeRoutes = router;

