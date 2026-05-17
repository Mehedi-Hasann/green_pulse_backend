import { NextFunction, Request, Response } from "express";
import { envVars } from "../../config/env";
import status from "http-status";
import z from "zod";
import { TErrorResponse, TErrorSources } from "../interfaces/error.interface";
import { handleZodError } from "../errorHelpers/handleZodError";
import AppError from "../errorHelpers/AppError";
import { deleteFileFromCloudinary } from "../../config/cloudinary.config";

export const globalErrorHandler = async (
  err: unknown,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // Logging for development
  if (envVars.NODE_ENV === "development") {
    console.error("DEBUG [Global Error]:", err);
  }

  // Cleanup uploaded files on error
  try {
    if (req.file) {
      await deleteFileFromCloudinary(req.file.path);
    }
    if (req.files && Array.isArray(req.files) && req.files.length > 0) {
      const imageUrls = req.files.map((file) => file.path);
      await Promise.all(imageUrls.map((url) => deleteFileFromCloudinary(url)));
    }
  } catch (cleanupError) {
    console.error("Cleanup Error:", cleanupError);
  }

  let statusCode: number = status.INTERNAL_SERVER_ERROR;
  let message: string = "Internal Server Error";
  let errorSources: TErrorSources[] = [
    {
      path: "",
      message: "Something went wrong",
    },
  ];

  if (err instanceof z.ZodError) {
    const simplifiedError = handleZodError(err);
    statusCode = simplifiedError.statusCode as number;
    message = simplifiedError.message;
    errorSources = simplifiedError.errorSources;
  } else if (err instanceof AppError) {
    statusCode = err.statusCode;
    message = err.message;
    errorSources = [
      {
        path: "",
        message: err.message,
      },
    ];
  } else if (err instanceof Error) {
    message = err.message;
    errorSources = [
      {
        path: "",
        message: err.message,
      },
    ];
  }

  const errorResponse: TErrorResponse = {
    success: false,
    message,
    errorSources,
    stack: envVars.NODE_ENV === "development" ? (err as Error)?.stack : undefined,
  };

  return res.status(statusCode).json(errorResponse);
};
