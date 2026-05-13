import { Router } from "express";
import { SuperAdminController } from "./super_admin.controller";
import { checkAuth } from "../../middleware/checkAuth";
import { Role } from "../../../generated/prisma";
import { validateRequest } from "../../middleware/validateRequest";
import { SuperAdminValidations } from "./super_admin.validate";

const router: Router = Router();

// Middleware to ensure all routes in this router are restricted to SUPER_ADMIN
router.use(checkAuth(Role.SUPER_ADMIN));

router.get("/admins", SuperAdminController.getAllAdmins); //ok
router.get("/admins/:id", SuperAdminController.getAdminById); //ok
router.patch(
  "/admins/:id",
  validateRequest(SuperAdminValidations.updateAdminSchema),
  SuperAdminController.updateAdmin
); //ok
router.delete("/admins/:id", SuperAdminController.deleteAdmin); //ok

// --- Member Management ---
router.get("/members", SuperAdminController.getAllMembers); //ok
router.get("/members/:id", SuperAdminController.getMemberById); //ok
router.patch(
  "/members/:id",
  validateRequest(SuperAdminValidations.updateMemberSchema),
  SuperAdminController.updateMember
);  //ok
router.delete("/members/:id", SuperAdminController.deleteMember);  //ok

// --- User Control ---
router.patch(
  "/users/:id/status",
  validateRequest(SuperAdminValidations.updateUserStatusSchema),
  SuperAdminController.updateUserStatus
);  //ok
router.patch(
  "/users/:id/role",
  validateRequest(SuperAdminValidations.updateUserRoleSchema),
  SuperAdminController.updateUserRole
);  //ok

// --- Challenge Management ---
router.get("/challenges", SuperAdminController.getAllChallenges); //ok
router.post(
  "/challenges",
  validateRequest(SuperAdminValidations.createChallengeSchema),
  SuperAdminController.createChallenge
); //ok
router.get("/challenges/:id", SuperAdminController.getChallengeById); //ok
router.patch(
  "/challenges/:id",
  validateRequest(SuperAdminValidations.updateChallengeSchema),
  SuperAdminController.updateChallenge
); //ok
router.delete("/challenges/:id", SuperAdminController.deleteChallenge); //ok

// --- Category Management ---
router.get("/categories", SuperAdminController.getAllCategories); //ok
router.post(
  "/categories",
  validateRequest(SuperAdminValidations.createCategorySchema),
  SuperAdminController.createCategory
); //ok
router.patch(
  "/categories/:id",
  validateRequest(SuperAdminValidations.updateCategorySchema),
  SuperAdminController.updateCategory
); //ok
router.delete("/categories/:id", SuperAdminController.deleteCategory);

// --- Payment Management ---
router.get("/payments", SuperAdminController.getAllPayments);  //ok
router.get("/payments/:id", SuperAdminController.getPaymentById); //ok

// --- Submission Management ---
router.get("/submissions", SuperAdminController.getAllSubmissions); //ok
router.get("/submissions/:id", SuperAdminController.getSubmissionById); //ok
router.patch(
  "/submissions/:id/status",
  validateRequest(SuperAdminValidations.updateSubmissionStatusSchema),
  SuperAdminController.updateSubmissionStatus
); //ok

// --- Analytics & Leaderboard ---
router.get("/analytics", SuperAdminController.getAnalytics); //ok
router.get("/leaderboard", SuperAdminController.getLeaderboard); //ok

// --- Dashboard ---
router.get("/dashboard", SuperAdminController.getDashboardSummary); //ok

export const SuperAdminRoutes = router;
