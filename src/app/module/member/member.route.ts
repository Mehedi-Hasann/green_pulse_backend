import { Router } from "express";
import { validateRequest } from "../../middleware/validateRequest";
import { MemberControllers } from "./member.controller";
import { MemberValidations } from "./member.validate";

const router: Router = Router();

router.get("/", MemberControllers.getAllMembers); //ok
router.get("/:id", MemberControllers.getMemberById);//ok
router.patch(
  "/:id",
  validateRequest(MemberValidations.updateMemberSchema),
  MemberControllers.updateMember
);//ok
router.delete("/:id", MemberControllers.deleteMember);

router.get("/:id/challenges", MemberControllers.getMemberChallenges);
router.get("/:id/submissions", MemberControllers.getMemberSubmissions);
router.get("/:id/payments", MemberControllers.getMemberPayments);

export const MemberRoutes = router;
