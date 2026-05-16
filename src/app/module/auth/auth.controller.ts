/* eslint-disable @typescript-eslint/no-explicit-any */
import { Request, Response } from "express";
import { catchAsync } from "../../shared/catchAsync";
import { AuthServices } from "./auth.service";
import { sendResponse } from "../../shared/sendResponse";
import status from "http-status";
import { tokenUtils } from "../../utils/token";
import AppError from "../../errorHelpers/AppError";
import { CookieUtils } from "../../utils/cookie";
import { envVars } from "../../../config/env";
import { auth } from "../../lib/auth";


const registerMember = catchAsync(
  async(req: Request, res: Response) => {

    const payload = {
      ...req.body,
      image : req.file?.path
    }
    // console.log(req.body)
    // if(!req.body.user?.role){
    //   req.body.user.role = Role.MEMBER;
    // }

    const result = await AuthServices.registerMember(payload);
    if (!result) {
      throw new AppError(status.INTERNAL_SERVER_ERROR, "Registration failed");
    }

    const { accessToken, token, ...rest } = result as any;

    tokenUtils.setAccessTokenCookie(res, accessToken);
    tokenUtils.setBetterAuthSessionCookie(res, token);

    sendResponse(res,{
      httpStatusCode : status.CREATED,
      success : true,
      message : "Member Created Successfully",
      data : {
        token,
        accessToken,
        ...rest
      }
    })
  }
)

const loginUser = catchAsync(
  async (req: Request, res: Response) => {
    const payload = req.body;
    const result = await AuthServices.loginUser(payload);
    if (!result) {
      throw new AppError(status.INTERNAL_SERVER_ERROR, "Login failed");
    }

    const {accessToken, token, ...rest} = result;

    tokenUtils.setAccessTokenCookie(res, accessToken);
    tokenUtils.setBetterAuthSessionCookie(res, token);

    sendResponse(res, {
      httpStatusCode: status.OK,
      success: true,
      message: "User logged in successfully",
      data : {
        token,
        accessToken,
        ...rest
      }
    })
  }
)

const getMe = catchAsync(
  async (req: Request, res: Response) => {
    console.log("User in getMe controller ", req.user);
    const result = await AuthServices.getMe(req.user as any);

    sendResponse(res, {
      httpStatusCode: status.OK,
      success: true,
      message: "User fetched successfully",
      data: result
    });
  }
)

const getSession = catchAsync(
  async (req: Request, res: Response) => {
    const sessionToken = req.cookies["better-auth.session_token"];
    const result = await AuthServices.getSession(sessionToken);

    sendResponse(res, {
      httpStatusCode: status.OK,
      success: true,
      message: "Session retrieved successfully",
      data: result
    });
  }
)

const changePassword = catchAsync(
  async (req: Request, res: Response) => {
    const payload = req.body;
    const betterAuthSessionToken = req.cookies["better-auth.session_token"];
    // console.log(betterAuthSessionToken);

    const result = await AuthServices.changePassword(payload, betterAuthSessionToken);

    sendResponse(res,{
      httpStatusCode : status.OK,
      success : true,
      message : "Change password successfully",
      data : result
    })
  }
)

const logoutUser = catchAsync(
  async(req: Request, res: Response) => {
    const betterAuthSessionToken = req.cookies["better-auth.session_token"];

    const result = await AuthServices.logoutUser(betterAuthSessionToken);

    CookieUtils.clearCookie(res, "accessToken", {
      httpOnly: true,
      secure: envVars.NODE_ENV === "production",
      sameSite: "none"
    });

    CookieUtils.clearCookie(res, 'better-auth.session_token', {
      httpOnly: true,
      secure: envVars.NODE_ENV === "production",
      sameSite: "none"
    });


    sendResponse(res, {
      httpStatusCode : status.OK,
      success : true,
      message : "User Log out successfully",
      data : result
    })
  }
)

const verifyEmail = catchAsync(
  async(req: Request, res: Response) => {
    const {email, otp} = req.body;

    const result = await AuthServices.verifyEmail(email, otp);

    sendResponse(res, {
      httpStatusCode : status.OK,
      success : true,
      message : "User Verified successfully",
      data : result
    })
  }
)

const forgetPassword = catchAsync(
  async(req: Request, res: Response) => {
    const {email} = req.body;

    const result = await AuthServices.forgetPassword(email);

    sendResponse(res, {
      httpStatusCode : status.OK,
      success : true,
      message : "Forget Password Done",
      data : result
    })
  }
)

const resetPassword = catchAsync(
  async(req: Request, res: Response) => {
    const {email, otp ,newPassword} = req.body;

    const result = await AuthServices.resetPassword(email, otp, newPassword);

    sendResponse(res, {
      httpStatusCode : status.OK,
      success : true,
      message : "Reset password Successfully",
      data : result
    })
  }
)

// /api/v1/auth/login/google?redirect=/profile
const googleLogin = catchAsync(
  async(req: Request, res: Response) => {
    const redirectPath = req.query.redirect || "/dashboard";
    // console.log(req.query.redirect);

    const encodedRedirectPath = encodeURIComponent(redirectPath as string);
    
    const callbackURL = `${envVars.BETTER_AUTH_URL}/api/v1/auth/google/success?redirect=${encodedRedirectPath}`;
    console.log("Callback URL is: ", callbackURL);

    res.render("googleRedirect",{
      callbackURL,
      betterAuthUrl : envVars.BETTER_AUTH_URL
    })
  }
)

const googleLoginSuccess = catchAsync(
  async(req: Request, res: Response) => {
    const redirectPath = req.query.redirect as string || "/dashboard";

    const sessionToken = req.cookies["better-auth.session_token"];
    console.log("session token is ", sessionToken);

    if(!sessionToken){
      return res.redirect(`${envVars.FRONTEND_URL}/login?error=oauth_failed`);
    }
console.log("Session token received from cookie: ", sessionToken);
    const session = await auth.api.getSession({
      headers : {
        "Cookie" : `better-auth.session_token=${sessionToken}`
      }
    })
console.log("hi from ",session);
    if(!session){
      res.redirect(`${envVars.FRONTEND_URL}/login?error=no_session_found`);
    }

    if(session && !session.user){
      return res.redirect(`${envVars.FRONTEND_URL}/login?error=no_user_found`);
    }
console.log("Session from better-auth ", session);
    const result = await AuthServices.googleLoginSuccess(session as any);

    const {accessToken} = result;

    tokenUtils.setAccessTokenCookie(res, accessToken);

    const isValidRedirectPath = redirectPath.startsWith("/") && !redirectPath.startsWith("//");
    const finalRedirectPath = isValidRedirectPath ? redirectPath : "/dashboard";

    res.redirect(`${envVars.FRONTEND_URL}${finalRedirectPath}`);
  }
)

const handlerOAuthError = catchAsync(
  async(req: Request, res: Response) => {
    const error = req.query.error || "oauth_failed";
    res.redirect(`${envVars.FRONTEND_URL}/login?error=${error}`);
  }
)

export const AuthController = {
  registerMember, loginUser, getMe, getSession, changePassword, logoutUser, verifyEmail, forgetPassword, resetPassword, googleLogin,
  googleLoginSuccess, handlerOAuthError
}