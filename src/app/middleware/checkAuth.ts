
import { NextFunction, Request, Response } from "express";
import { CookieUtils } from "../utils/cookie";
import AppError from "../errorHelpers/AppError";
import status from "http-status";
import { prisma } from "../lib/prisma";
import { Role, UserStatus } from "../../generated/prisma";
import { jwtUtils } from "../utils/jwt";
import { envVars } from "../../config/env";


export const checkAuth = (...authRoles: Role[]) => async(req: Request, res: Response, next: NextFunction) => {
  try {
    const sessionToken = CookieUtils.getCookie(req, "better-auth.session_token");
// console.log(sessionToken);
    if(!sessionToken){
      throw new AppError(status.UNAUTHORIZED,"You are not authorized");
    }

    if(sessionToken){
      const rawToken = sessionToken.split(".")[0];
      const sessionExists = await prisma.session.findFirst({
        where : {
          token : rawToken
        },
        include : {
          user : true
        }
      })
// console.log(sessionExists);
      const user = sessionExists?.user;
      if(!user){
        throw new AppError(status.INTERNAL_SERVER_ERROR, "Failed to fetched User using sessionToken")
      }

      if(user?.status === UserStatus.BLOCKED || user?.status === UserStatus.DELETED){
        throw new AppError(status.NOT_ACCEPTABLE, "User is deleted or blocked")
      }
      // console.log(authRoles);
      // console.log(user.role)
      // console.log(req.url);
      // console.log("user is ",user)
      // console.log(authRoles.includes(user.role));

      if(authRoles.length > 0 && !authRoles.includes(user.role)){
        throw new AppError(status.FORBIDDEN, "Forbidden access! You do not have permission to access this resource.");
      }

      req.user = {
        userId : user?.id as string,
        role : user?.role as Role,
        email : user?.email as string
      }

    }

    const accessToken = CookieUtils.getCookie(req, 'accessToken');

    if(!accessToken){
      throw new AppError(status.UNAUTHORIZED, 'Unauthorized access! No accessToken provided.')
    }

    const verifiedToken = jwtUtils.verifyToken(accessToken, envVars.ACCESS_TOKEN_SECRET);

    if(!verifiedToken.success){
      throw new AppError(status.UNAUTHORIZED, "Unauthorized access! Invalid access token.")
    }

    if(authRoles.length > 0 && !authRoles.includes(verifiedToken?.data?.role as Role)){
      throw new AppError(status.FORBIDDEN, "Forbidden access! You do not have permission to access to this resources.");
    }
// console.log("Access token is verified, user is authorized to access this resource.");

    next();
  } catch (error: unknown) {
    console.log(error);
    throw new AppError(status.INTERNAL_SERVER_ERROR,"Error occur in checkAuth Middleware.")
  }
}