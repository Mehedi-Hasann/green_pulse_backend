import status from "http-status";
import { Request, Response } from "express";
import { catchAsync } from "../../shared/catchAsync";
import { sendResponse } from "../../shared/sendResponse";
import { SubmissionService } from "./submission.service";
import { IQueryParams } from "../../interfaces/query.interface";

const createSubmission = catchAsync(async (req: Request, res: Response) => {
  if (req.files && Array.isArray(req.files)) {
    const proofs = (req.files as any[]).map((file) => file.path);
    req.body.proofs = proofs;
  }
  const {userId} = req.user;
  const result = await SubmissionService.createSubmission(req.body, userId as string);

  sendResponse(res, {
    httpStatusCode: status.CREATED,
    success: true,
    message: "Submission created successfully",
    data: result,
  });
});

const getAllSubmissions = catchAsync(async (req: Request, res: Response) => {
  const result = await SubmissionService.getAllSubmissions(req.query as IQueryParams);

  sendResponse(res, {
    httpStatusCode: status.OK,
    success: true,
    message: "Submissions fetched successfully",
    meta: result.meta,
    data: result.data,
  });
});

const getSubmissionById = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await SubmissionService.getSubmissionById(id as string, req.user);

  sendResponse(res, {
    httpStatusCode: status.OK,
    success: true,
    message: "Submission details fetched successfully",
    data: result,
  });
});

const getSubmissionsByMemberId = catchAsync(async (req: Request, res: Response) => {
  const { memberId } = req.params;
  const result = await SubmissionService.getSubmissionsByMemberId(memberId as string, req.query as IQueryParams, req.user);

  sendResponse(res, {
    httpStatusCode: status.OK,
    success: true,
    message: "Member submissions fetched successfully",
    meta: result.meta,
    data: result.data,
  });
});

const getSubmissionsByChallengeId = catchAsync(async (req: Request, res: Response) => {
  const { challengeId } = req.params;
  console.log("HIIIIIIII")
  console.log(challengeId)
  const result = await SubmissionService.getSubmissionsByChallengeId(challengeId as string, req.query as IQueryParams);

  sendResponse(res, {
    httpStatusCode: status.OK,
    success: true,
    message: "Challenge submissions fetched successfully",
    meta: result.meta,
    data: result.data,
  });
});

const updateSubmission = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  if (req.files && Array.isArray(req.files)) {
    const proofs = (req.files as any[]).map((file) => file.path);
    req.body.proofs = proofs;
  }

  const result = await SubmissionService.updateSubmissionInDB(id as string, req.body, req.user);

  sendResponse(res, {
    httpStatusCode: status.OK,
    success: true,
    message: "Submission updated successfully",
    data: result,
  });
});

const deleteSubmission = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await SubmissionService.deleteSubmission(id as string);

  sendResponse(res, {
    httpStatusCode: status.OK,
    success: true,
    message: "Submission deleted successfully",
    data: result,
  });
});

export const SubmissionController = {
  createSubmission,
  getAllSubmissions,
  getSubmissionById,
  getSubmissionsByMemberId,
  getSubmissionsByChallengeId,
  updateSubmission,
  deleteSubmission,
};
