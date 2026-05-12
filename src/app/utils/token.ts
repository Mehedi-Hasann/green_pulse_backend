import { JwtPayload, SignOptions } from "jsonwebtoken";
import { jwtUtils } from "./jwt";
import { envVars } from "../../config/env";
import { Response } from "express";
import { CookieUtils } from "./cookie";

const getAccessToken = (payload : JwtPayload) => {
  const accessToken = jwtUtils.createToken(
    payload, 
    envVars.ACCESS_TOKEN_SECRET, 
    {expiresIn : envVars.ACCESS_TOKEN_EXPIRES_IN} as SignOptions
  );

  return accessToken;
}

const setAccessTokenCookie = (res: Response, token : string) => {
  CookieUtils.setCookie(res, 'accessToken', token, {
    httpOnly : true,
    secure : true,
    sameSite : "none",
    path : '/',
    maxAge : 60*60*24*100,
  })
}

const setBetterAuthSessionCookie = (res: Response, token : string) => {
  CookieUtils.setCookie(res, 'better-auth.session_token', token, {
    httpOnly : true,
    secure : true,
    sameSite : "none",
    path : '/',
    maxAge : 60*60*24*100
  })
}

export const tokenUtils = {
  getAccessToken,
  setAccessTokenCookie,
  setBetterAuthSessionCookie
}