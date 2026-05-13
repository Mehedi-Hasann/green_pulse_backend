import { NextFunction, Request, Response, Router } from "express";
import { SubmissionController } from "./submission.controller";
import { validateRequest } from "../../middleware/validateRequest";
import { SubmissionValidations } from "./submission.validate";
import { multerUpload } from "../../../config/multer.config";
import { checkAuth } from "../../middleware/checkAuth";
import { Role } from "../../../generated/prisma";

const router: Router = Router();

router.post(
  "/",
  checkAuth(Role.MEMBER),
  multerUpload.fields([
    {name : "proofs", maxCount : 2}
  ]),
  (req: Request, res: Response, next: NextFunction) => {

    if (req.body.data) {
      req.body = JSON.parse(req.body.data);
    }
    const files = req.files as { [fieldName: string]: Express.Multer.File[] | undefined };

    if (files?.proofs && files.proofs.length > 0) {
      req.body.proofs = files.proofs.map((file) => file.path);
    }
    next();
  },
  validateRequest(SubmissionValidations.createSubmissionSchema),

  SubmissionController.createSubmission
); //ok

router.get(
  "/",
  checkAuth(Role.ADMIN, Role.SUPER_ADMIN),
  SubmissionController.getAllSubmissions
); //ok

router.get(
  "/:id",
  checkAuth(Role.ADMIN, Role.SUPER_ADMIN),
  SubmissionController.getSubmissionById
); //ok

router.get(
  "/member/:memberId",
  checkAuth(Role.ADMIN, Role.SUPER_ADMIN, Role.MEMBER),
  SubmissionController.getSubmissionsByMemberId
); //ok

router.get(
  "/challenge/:challengeId",
  checkAuth(Role.ADMIN, Role.SUPER_ADMIN),
  SubmissionController.getSubmissionsByChallengeId
);

router.patch(
  "/:id",
  checkAuth(Role.ADMIN, Role.SUPER_ADMIN, Role.MEMBER),
  multerUpload.array("files"),
  validateRequest(SubmissionValidations.updateSubmissionSchema),
  SubmissionController.updateSubmission
);

router.delete(
  "/:id",
  checkAuth(Role.ADMIN, Role.SUPER_ADMIN),
  SubmissionController.deleteSubmission
);

export const SubmissionRoutes = router;
