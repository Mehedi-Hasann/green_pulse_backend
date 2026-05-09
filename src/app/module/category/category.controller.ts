import { Request, Response } from "express";
import { CategoryService } from "./category.service";
import { catchAsync } from "../../shared/catchAsync";
import { sendResponse } from "../../shared/sendResponse";


const createCategory = catchAsync(
  async(req: Request, res: Response) => {

    const payload = req.body;
    const result = await CategoryService.createCategory(payload);

    sendResponse(res,{
      httpStatusCode : 201,
      success : true,
      message : "Category Created",
      data : result
    })
  }
)


export const CategoryController = {
  createCategory
}