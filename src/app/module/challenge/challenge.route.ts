import { Router } from "express";
import { validateRequest } from "../../middleware/validateRequest";
import { ChallengeController } from "./challenge.controller";
import { ChallengeValidations } from "./challenge.validate";
import { checkAuth } from "../../middleware/checkAuth";
import { Role } from "../../../generated/prisma";

const router: Router = Router();

router.post(
  "/",
  validateRequest(ChallengeValidations.createChallengeSchema),
  ChallengeController.createChallenge,
); //ok

router.get("/", ChallengeController.getAllChallenges); //ok
router.get("/:id", ChallengeController.getChallengeById); //ok

router.patch(
  "/:id",
  ChallengeController.updateChallenge
); //ok

router.delete("/:id", ChallengeController.deleteChallenge); //ok

export const ChallengeRoutes = router;
