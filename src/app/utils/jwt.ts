
import jwt, { JwtPayload, SignOptions } from "jsonwebtoken";

const createToken = (payload: JwtPayload, secret : string, options : SignOptions) => {
  const token = jwt.sign(payload, secret, options);
  return token;
}

const verifyToken = (token : string, secret : string) => {
  try {
    const decoded = jwt.verify(token,secret) as JwtPayload;
    return {
      success : true,
      data : decoded
    };
  } catch (error: unknown) {
    return {
      success : false,
      message : (error as Error).message,
      error
    }
  }
}

const decoded = (token : string) => {
  const decoded = jwt.decode(token) as JwtPayload;
  return decoded;
}

export const jwtUtils = {
  createToken, verifyToken, decoded
}