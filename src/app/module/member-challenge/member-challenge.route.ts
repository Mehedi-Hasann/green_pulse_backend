import { Router } from "express";
import { validateRequest } from "../../middleware/validateRequest";
import { MemberChallengeController } from "./member-challenge.controller";
import { MemberChallengeValidations } from "./member-challenge.validate";
import { Role } from "../../../generated/prisma";
import { checkAuth } from "../../middleware/checkAuth";

const router: Router = Router();

router.post(
  "/",
  validateRequest(MemberChallengeValidations.joinChallengeSchema),
  checkAuth(Role.MEMBER),
  MemberChallengeController.CreateMemberChallenge
); //ok

router.get("/", MemberChallengeController.getAllMemberChallenges); //ok

router.get("/",checkAuth(Role.MEMBER) ,MemberChallengeController.getSingleMemberChallenge);

router.get(
  "/my-challenge",checkAuth(Role.MEMBER),
  MemberChallengeController.getMyChallengesByMemberId
); //ok

router.patch(
  "/:id",
  validateRequest(MemberChallengeValidations.updateMemberChallengeSchema),
  MemberChallengeController.updateMemberChallengeByMemberChallengeId
); //ok

router.delete("/:id", MemberChallengeController.deleteMemberChallenge); //ok

export const MemberChallengeRoutes = router;
