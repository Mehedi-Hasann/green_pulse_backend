import status from "http-status";
import { catchAsync } from "../../shared/catchAsync";
import { sendResponse } from "../../shared/sendResponse";
import { UserServices } from "./user.service";

const getAllUsers = catchAsync(async (req, res) => {
  const result = await UserServices.getAllUsersFromDB();

  sendResponse(res, {
    httpStatusCode: status.OK,
    success: true,
    message: "Users fetched successfully",
    data: result,
  });
});

const getUserById = catchAsync(async (req, res) => {
  const { id : memberId } = req.params;
  const result = await UserServices.getUserByIdFromDB(memberId as string);

  sendResponse(res, {
    httpStatusCode: status.OK,
    success: true,
    message: "User fetched successfully",
    data: result,
  });
});

const updateUserByMember = catchAsync(async (req, res) => {
  const { id } = req.params;
  const payload = {
    ...req.body,
    ...(req.file?.path ? { profileImage: req.file.path } : {}),
  };

  const result = await UserServices.updateUserByMember(id as string, payload, req.user);

  sendResponse(res, {
    httpStatusCode: status.OK,
    success: true,
    message: "User updated successfully",
    data: result,
  });
});

const deleteUser = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await UserServices.deleteUserFromDB(id as string);

  sendResponse(res, {
    httpStatusCode: status.OK,
    success: true,
    message: "User deleted successfully",
    data: result,
  });
});

export const UserControllers = {
  getAllUsers,
  getUserById,
  updateUserByMember,
  deleteUser,
};
