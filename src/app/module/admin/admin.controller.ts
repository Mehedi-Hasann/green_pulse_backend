import status from "http-status";
import { Request, Response } from "express";
import { catchAsync } from "../../shared/catchAsync";
import { sendResponse } from "../../shared/sendResponse";
import { AdminServices } from "./admin.service";
import AppError from "../../errorHelpers/AppError";

const updateUser = catchAsync(async (req: Request, res: Response) => {
  const userId = req.params.id as string;
  // console.log(userId)

  if (!userId) {
    throw new AppError(status.BAD_REQUEST, "userId query parameter is required");
  }

  const result = await AdminServices.updateUserByAdmin(userId, req.body);

  sendResponse(res, {
    httpStatusCode: status.OK,
    success: true,
    message: "User updated successfully",
    data: result,
  });
});

export const AdminController = {
  updateUser,
};
