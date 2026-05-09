import { Request, Response } from "express";
import { catchAsync } from "../../shared/catchAsync";
import { AuthServices } from "./auth.service";
import { sendResponse } from "../../shared/sendResponse";

const registerMember = catchAsync(
  async(req: Request, res: Response) => {
    const payload = req.body;
    // console.log(req.body);

    const result = await AuthServices.registerMember(payload);

    sendResponse(res,{
      httpStatusCode : 201,
      success : true,
      message : "Member Created Successfully",
      data : result
    })
  }
)


export const AuthController = {
  registerMember
}