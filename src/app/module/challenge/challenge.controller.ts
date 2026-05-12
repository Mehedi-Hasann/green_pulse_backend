import status from "http-status";
import { Request, Response } from "express";
import { catchAsync } from "../../shared/catchAsync";
import { sendResponse } from "../../shared/sendResponse";
import { ChallengeService } from "./challenge.service";

const createChallenge = catchAsync(async (req: Request, res: Response) => {
  const result = await ChallengeService.createChallengeIntoDB(req.body);

  sendResponse(res, {
    httpStatusCode: status.CREATED,
    success: true,
    message: "Challenge created successfully",
    data: result,
  });
});

const getAllChallenges = catchAsync(async (_req: Request, res: Response) => {
  const result = await ChallengeService.getAllChallengesFromDB();

  sendResponse(res, {
    httpStatusCode: status.OK,
    success: true,
    message: "Challenges fetched successfully",
    data: result,
  });
});

const getChallengeById = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await ChallengeService.getChallengeByIdFromDB(id as string);

  sendResponse(res, {
    httpStatusCode: status.OK,
    success: true,
    message: "Challenge fetched successfully",
    data: result,
  });
});

const updateChallenge = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;

  const result = await ChallengeService.updateChallengeInDB(id as string, req.body);

  sendResponse(res, {
    httpStatusCode: status.OK,
    success: true,
    message: "Challenge updated successfully",
    data: result,
  });
});

const deleteChallenge = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await ChallengeService.deleteChallengeFromDB(id as string);

  sendResponse(res, {
    httpStatusCode: status.OK,
    success: true,
    message: "Challenge cancelled successfully",
    data: result,
  });
});

export const ChallengeController = {
  createChallenge,
  getAllChallenges,
  getChallengeById,
  updateChallenge,
  deleteChallenge,
};
