import status from "http-status";
import { catchAsync } from "../../shared/catchAsync";
import { sendResponse } from "../../shared/sendResponse";
import { MemberServices } from "./member.service";

const getAllMembers = catchAsync(async (req, res) => {
  const result = await MemberServices.getAllMembersFromDB();

  sendResponse(res, {
    httpStatusCode: status.OK,
    success: true,
    message: "Members fetched successfully",
    data: result,
  });
});

const getMemberById = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await MemberServices.getMemberByIdFromDB(id as string);

  sendResponse(res, {
    httpStatusCode: status.OK,
    success: true,
    message: "Member fetched successfully",
    data: result,
  });
});

const updateMember = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await MemberServices.updateMemberInDB(id as string, req.body);

  sendResponse(res, {
    httpStatusCode: status.OK,
    success: true,
    message: "Member updated successfully",
    data: result,
  });
});

const deleteMember = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await MemberServices.deleteMemberFromDB(id as string);

  sendResponse(res, {
    httpStatusCode: status.OK,
    success: true,
    message: "Member deleted successfully",
    data: result,
  });
});

const getMemberChallenges = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await MemberServices.getMemberChallengesFromDB(id as string);

  sendResponse(res, {
    httpStatusCode: status.OK,
    success: true,
    message: "Member challenges fetched successfully",
    data: result,
  });
});

const getMemberSubmissions = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await MemberServices.getMemberSubmissionsFromDB(id as string);

  sendResponse(res, {
    httpStatusCode: status.OK,
    success: true,
    message: "Member submissions fetched successfully",
    data: result,
  });
});

const getMemberPayments = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await MemberServices.getMemberPaymentsFromDB(id as string);

  sendResponse(res, {
    httpStatusCode: status.OK,
    success: true,
    message: "Member payments fetched successfully",
    data: result,
  });
});

const GetMemberStats = catchAsync(async (req, res) => {
  const { userId } = req.user;
  const result = await MemberServices.getMemberStatsFromDB(userId);

  sendResponse(res, {
    httpStatusCode: status.OK,
    success: true,
    message: "Member stats fetched successfully",
    data: result,
  });
});

export const MemberControllers = {
  getAllMembers,
  getMemberById,
  updateMember,
  deleteMember,
  getMemberChallenges,
  getMemberSubmissions,
  getMemberPayments,
  GetMemberStats,
};
