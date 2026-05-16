import { Router } from "express";
import { SuperAdminController } from "./super_admin.controller";
import { checkAuth } from "../../middleware/checkAuth";
import { Role } from "../../../generated/prisma";
import { validateRequest } from "../../middleware/validateRequest";
import { SuperAdminValidations } from "./super_admin.validate";
import { multerUpload } from "../../../config/multer.config";

const router: Router = Router();

// Middleware to ensure all routes in this router are restricted to SUPER_ADMIN


router.get("/admins", checkAuth(Role.SUPER_ADMIN),SuperAdminController.getAllAdmins);
router.get("/admins/:id",checkAuth(Role.SUPER_ADMIN), SuperAdminController.getAdminById);
router.patch(
  "/admins/:id",
  validateRequest(SuperAdminValidations.updateAdminSchema),checkAuth(Role.SUPER_ADMIN),
  SuperAdminController.updateAdmin
);
router.delete("/admins/:id", checkAuth(Role.SUPER_ADMIN),SuperAdminController.deleteAdmin);

// --- Member Management ---
router.get("/members",checkAuth(Role.SUPER_ADMIN), SuperAdminController.getAllMembers); 
router.get("/members/:id",checkAuth(Role.SUPER_ADMIN), SuperAdminController.getMemberById); 
router.patch(
  "/members/:id",
  validateRequest(SuperAdminValidations.updateMemberSchema),checkAuth(Role.SUPER_ADMIN),
  SuperAdminController.updateMember
);  
router.delete("/members/:id",checkAuth(Role.SUPER_ADMIN), SuperAdminController.deleteMember); 

// --- User Control ---
router.patch(
  "/users/:id/status",
  validateRequest(SuperAdminValidations.updateUserStatusSchema),checkAuth(Role.SUPER_ADMIN),
  SuperAdminController.updateUserStatus
);  
router.patch(
  "/users/:id/role",checkAuth(Role.SUPER_ADMIN),
  validateRequest(SuperAdminValidations.updateUserRoleSchema),
  SuperAdminController.updateUserRole
);  

// --- Challenge Management ---
router.get("/challenges", checkAuth(Role.SUPER_ADMIN),SuperAdminController.getAllChallenges);
router.post(
  "/challenges",checkAuth(Role.ADMIN,Role.SUPER_ADMIN),
  validateRequest(SuperAdminValidations.createChallengeSchema),
  SuperAdminController.createChallenge
);
router.get("/challenges/:id",checkAuth(Role.ADMIN,Role.SUPER_ADMIN), SuperAdminController.getChallengeById);
router.patch(
  "/challenges/:id",checkAuth(Role.ADMIN,Role.SUPER_ADMIN),
  validateRequest(SuperAdminValidations.updateChallengeSchema),
  SuperAdminController.updateChallenge
);
router.delete("/challenges/:id",checkAuth(Role.ADMIN,Role.SUPER_ADMIN), SuperAdminController.deleteChallenge);

// --- Category Management ---
router.get("/categories",checkAuth(Role.ADMIN,Role.SUPER_ADMIN), SuperAdminController.getAllCategories); 
router.post(
  "/categories",checkAuth(Role.SUPER_ADMIN),
  validateRequest(SuperAdminValidations.createCategorySchema),
  SuperAdminController.createCategory
); 
router.patch(
  "/categories/:id",checkAuth(Role.SUPER_ADMIN),
  validateRequest(SuperAdminValidations.updateCategorySchema),
  SuperAdminController.updateCategory
); 
router.delete("/categories/:id",checkAuth(Role.SUPER_ADMIN), SuperAdminController.deleteCategory);

// --- Payment Management ---
router.get("/payments", checkAuth(Role.SUPER_ADMIN),SuperAdminController.getAllPayments);
router.get("/payments/:id",checkAuth(Role.SUPER_ADMIN), SuperAdminController.getPaymentById);

// --- Submission Management ---
router.get("/submissions",checkAuth(Role.SUPER_ADMIN), SuperAdminController.getAllSubmissions);
router.get("/submissions/pending",checkAuth(Role.ADMIN,Role.SUPER_ADMIN), SuperAdminController.getPendingSubmissions);
router.get("/submissions/:id",checkAuth(Role.SUPER_ADMIN), SuperAdminController.getSubmissionById);
router.patch(
  "/submissions/:id/status",checkAuth(Role.ADMIN,Role.SUPER_ADMIN),
  validateRequest(SuperAdminValidations.updateSubmissionStatusSchema),
  SuperAdminController.updateSubmissionStatus
);

// --- Analytics & Leaderboard ---
router.get("/analytics",checkAuth(Role.ADMIN,Role.SUPER_ADMIN), SuperAdminController.getAnalytics);
router.get("/leaderboard",SuperAdminController.getLeaderboard);

// --- Dashboard ---
router.get("/dashboard",checkAuth(Role.ADMIN,Role.SUPER_ADMIN), SuperAdminController.getDashboardSummary);

router.patch(
  "/:id",
  multerUpload.single("file"),
  checkAuth(Role.SUPER_ADMIN),
  validateRequest(SuperAdminValidations.updateUserSchema),
  SuperAdminController.UpdateSuperAdminBySuperAdmin
);

export const SuperAdminRoutes = router;
