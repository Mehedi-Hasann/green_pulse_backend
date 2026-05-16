import status from "http-status";
import { Request, Response } from "express";
import { catchAsync } from "../../shared/catchAsync";
import { sendResponse } from "../../shared/sendResponse";
import { SuperAdminService } from "./super_admin.service";
import { IQueryParams } from "../../interfaces/query.interface";


//  --- Admin Management ---

const getAllAdmins = catchAsync(async (req: Request, res: Response) => {
  const result = await SuperAdminService.getAllAdmins(req.query as IQueryParams);
  sendResponse(res, {
    httpStatusCode: status.OK,
    success: true,
    message: "Admins fetched successfully",
    meta: result.meta,
    data: result.data,
  });
});

const getAdminById = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await SuperAdminService.getAdminById(id as string);
  sendResponse(res, {
    httpStatusCode: status.OK,
    success: true,
    message: "Admin details fetched successfully",
    data: result,
  });
});

const updateAdmin = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await SuperAdminService.updateAdmin(id as string, req.body);
  sendResponse(res, {
    httpStatusCode: status.OK,
    success: true,
    message: "Admin updated successfully",
    data: result,
  });
});

const deleteAdmin = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await SuperAdminService.deleteAdmin(id as string);
  sendResponse(res, {
    httpStatusCode: status.OK,
    success: true,
    message: "Admin deleted successfully",
    data: result,
  });
});

// --- Member Management ---

const getAllMembers = catchAsync(async (req: Request, res: Response) => {
  const result = await SuperAdminService.getAllMembers(req.query as IQueryParams);
  sendResponse(res, {
    httpStatusCode: status.OK,
    success: true,
    message: "Members fetched successfully",
    meta: result.meta,
    data: result.data,
  });
});

const getMemberById = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await SuperAdminService.getMemberById(id as string);
  sendResponse(res, {
    httpStatusCode: status.OK,
    success: true,
    message: "Member details fetched successfully",
    data: result,
  });
});

const updateMember = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await SuperAdminService.updateMember(id as string, req.body);
  sendResponse(res, {
    httpStatusCode: status.OK,
    success: true,
    message: "Member updated successfully",
    data: result,
  });
});

const deleteMember = catchAsync(async (req: Request, res: Response) => {
  const { id: userId } = req.params;
  // console.log("id is ",userId)
  const result = await SuperAdminService.deleteMember(userId as string);
  sendResponse(res, {
    httpStatusCode: status.OK,
    success: true,
    message: "Member blocked/deleted successfully",
    data: result,
  });
});

// --- User Control ---

const updateUserStatus = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const { status: userStatus } = req.body;
  const result = await SuperAdminService.updateUserStatus(id as string, userStatus);
  sendResponse(res, {
    httpStatusCode: status.OK,
    success: true,
    message: "User status updated successfully",
    data: result,
  });
});

const updateUserRole = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const { role } = req.body;
  const result = await SuperAdminService.updateUserRole(id as string, role);
  sendResponse(res, {
    httpStatusCode: status.OK,
    success: true,
    message: "User role updated successfully",
    data: result,
  });
});

// --- Challenge Management ---

const getAllChallenges = catchAsync(async (req: Request, res: Response) => {
  const result = await SuperAdminService.getAllChallenges(req.query as IQueryParams);
  sendResponse(res, {
    httpStatusCode: status.OK,
    success: true,
    message: "Challenges fetched successfully",
    meta: result.meta,
    data: result.data,
  });
});

const createChallenge = catchAsync(async (req: Request, res: Response) => {

  console.log("Req Body :", req.body);
  const result = await SuperAdminService.createChallengeIntoDB(req.body);
  sendResponse(res, {
    httpStatusCode: status.CREATED,
    success: true,
    message: "Challenge created successfully",
    data: result,
  });
});

const getChallengeById = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await SuperAdminService.getChallengeById(id as string);
  sendResponse(res, {
    httpStatusCode: status.OK,
    success: true,
    message: "Challenge details fetched successfully",
    data: result,
  });
});

const updateChallenge = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  // console.log("Req Body :", req.body);
  const result = await SuperAdminService.updateChallenge(id as string, req.body);
  sendResponse(res, {
    httpStatusCode: status.OK,
    success: true,
    message: "Challenge updated successfully",
    data: result,
  });
});

const deleteChallenge = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await SuperAdminService.deleteChallenge(id as string);
  sendResponse(res, {
    httpStatusCode: status.OK,
    success: true,
    message: "Challenge deleted successfully",
    data: result,
  });
});

// --- Category Management ---

const getAllCategories = catchAsync(async (req: Request, res: Response) => {
  const result = await SuperAdminService.getAllCategories(req.query as IQueryParams);
  sendResponse(res, {
    httpStatusCode: status.OK,
    success: true,
    message: "Categories fetched successfully",
    meta: result.meta,
    data: result.data,
  });
});

const createCategory = catchAsync(async (req: Request, res: Response) => {
  const result = await SuperAdminService.createCategoryIntoDB(req.body);
  sendResponse(res, {
    httpStatusCode: status.CREATED,
    success: true,
    message: "Category created successfully",
    data: result,
  });
});

const updateCategory = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await SuperAdminService.updateCategory(id as string, req.body);
  sendResponse(res, {
    httpStatusCode: status.OK,
    success: true,
    message: "Category updated successfully",
    data: result,
  });
});

const deleteCategory = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await SuperAdminService.deleteCategory(id as string);
  sendResponse(res, {
    httpStatusCode: status.OK,
    success: true,
    message: "Category deleted successfully",
    data: result,
  });
});

// --- Payment Management ---

const getAllPayments = catchAsync(async (req: Request, res: Response) => {
  const result = await SuperAdminService.getAllPayments(req.query as IQueryParams);
  sendResponse(res, {
    httpStatusCode: status.OK,
    success: true,
    message: "Payments fetched successfully",
    meta: result.meta,
    data: result.data,
  });
});

const getPaymentById = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await SuperAdminService.getPaymentById(id as string);
  sendResponse(res, {
    httpStatusCode: status.OK,
    success: true,
    message: "Payment details fetched successfully",
    data: result,
  });
});

// --- Submission Management ---

const getAllSubmissions = catchAsync(async (req: Request, res: Response) => {
  const result = await SuperAdminService.getAllSubmissions(req.query as IQueryParams);
  sendResponse(res, {
    httpStatusCode: status.OK,
    success: true,
    message: "Submissions fetched successfully",
    meta: result.meta,
    data: result.data,
  });
});

const getPendingSubmissions = catchAsync(async (req: Request, res: Response) => {
  const result = await SuperAdminService.getPendingSubmissions(req.query as IQueryParams);
  sendResponse(res, {
    httpStatusCode: status.OK,
    success: true,
    message: "Pending submissions fetched successfully",
    meta: result.meta,
    data: result.data,
  });
});

const getSubmissionById = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await SuperAdminService.getSubmissionById(id as string);
  sendResponse(res, {
    httpStatusCode: status.OK,
    success: true,
    message: "Submission details fetched successfully",
    data: result,
  });
});

const updateSubmissionStatus = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const { status: submissionStatus } = req.body;
  const result = await SuperAdminService.updateSubmissionStatus(id as string, submissionStatus);
  sendResponse(res, {
    httpStatusCode: status.OK,
    success: true,
    message: "Submission status updated successfully",
    data: result,
  });
});

// --- Analytics & Leaderboard ---

const getAnalytics = catchAsync(async (req: Request, res: Response) => {
  const result = await SuperAdminService.getAnalytics();
  sendResponse(res, {
    httpStatusCode: status.OK,
    success: true,
    message: "Analytics fetched successfully",
    data: result,
  });
});

const getLeaderboard = catchAsync(async (req: Request, res: Response) => {
  const result = await SuperAdminService.getLeaderboard();
  sendResponse(res, {
    httpStatusCode: status.OK,
    success: true,
    message: "Leaderboard fetched successfully",
    data: result,
  });
});

// --- Dashboard ---

const getDashboardSummary = catchAsync(async (req: Request, res: Response) => {
  const result = await SuperAdminService.getDashboardSummary();
  sendResponse(res, {
    httpStatusCode: status.OK,
    success: true,
    message: "Dashboard summary fetched successfully",
    data: result,
  });
});

const UpdateSuperAdminBySuperAdmin = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const payload = {
    ...req.body,
    ...(req.file?.path ? { profileImage: req.file.path } : {}),
  };
  const result = await SuperAdminService.UpdateSuperAdminBySuperAdmin(id as string, payload);
  sendResponse(res, {
    httpStatusCode: status.OK,
    success: true,
    message: "Super Admin updated successfully",
    data: result,
  });
});

export const SuperAdminController = {
  getAllAdmins,
  getAdminById,
  updateAdmin,
  deleteAdmin,
  getAllMembers,
  getMemberById,
  updateMember,
  deleteMember,
  updateUserStatus,
  updateUserRole,
  getAllChallenges,
  createChallenge,
  getChallengeById,
  updateChallenge,
  deleteChallenge,
  getAllCategories,
  createCategory,
  updateCategory,
  deleteCategory,
  getAllPayments,
  getPaymentById,
  getAllSubmissions,
  getPendingSubmissions,
  getSubmissionById,
  updateSubmissionStatus,
  getAnalytics,
  getLeaderboard,
  getDashboardSummary,
  UpdateSuperAdminBySuperAdmin
};
