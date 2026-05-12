import status from "http-status";
import { Request, Response } from "express";
import { IQueryParams } from "../../interfaces/query.interface";
import { catchAsync } from "../../shared/catchAsync";
import { sendResponse } from "../../shared/sendResponse";
import { MemberChallengeService } from "./member-challenge.service";


const CreateMemberChallenge = catchAsync(async (req: Request, res: Response) => {
  console.log("req.user is => ",req.user)
  const {userId} = req.user;
  const {challengeId} = req.body;
  // console.log(challengeId)
  const result = await MemberChallengeService.CreateMemberChallenge(userId, challengeId);

  sendResponse(res, {
    httpStatusCode: status.CREATED,
    success: true,
    message: "Member joined to Challenge successfully",
    data: result,
  });
});

const getAllMemberChallenges = catchAsync(async (req: Request<any, any, any, IQueryParams>, res: Response) => {
  const result = await MemberChallengeService.getAllMemberChallenges(req.query);


  sendResponse(res, {
    httpStatusCode: status.OK,
    success: true,
    message: "Member challenges fetched successfully",
    data: result.data,
    meta: result.meta,
  });
});

const getSingleMemberChallenge = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await MemberChallengeService.getSingleMemberChallenge(id as string);

  sendResponse(res, {
    httpStatusCode: status.OK,
    success: true,
    message: "Member challenge fetched successfully",
    data: result,
  });
});

const getMemberChallengesByMemberId = catchAsync(async (req: Request, res: Response) => {
  const { memberId } = req.params;
  const result = await MemberChallengeService.getMemberChallengesByMemberId(
    memberId as string,
    req.query
  );


  sendResponse(res, {
    httpStatusCode: status.OK,
    success: true,
    message: "Member's challenges fetched successfully",
    data: result.data,
    meta: result.meta,
  });
});

const updateMemberChallengeByMemberChallengeId = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await MemberChallengeService.updateMemberChallengeByMemberChallengeId(id as string, req.body);

  sendResponse(res, {
    httpStatusCode: status.OK,
    success: true,
    message: "Member challenge updated successfully",
    data: result,
  });
});

const deleteMemberChallenge = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await MemberChallengeService.deleteMemberChallenge(id as string);

  sendResponse(res, {
    httpStatusCode: status.OK,
    success: true,
    message: "Member challenge deleted successfully",
    data: result,
  });
});

export const MemberChallengeController = {
  CreateMemberChallenge,
  getAllMemberChallenges,
  getSingleMemberChallenge,
  getMemberChallengesByMemberId,
  updateMemberChallengeByMemberChallengeId,
  deleteMemberChallenge,
};
