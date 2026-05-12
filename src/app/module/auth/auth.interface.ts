import { Role } from "../../../generated/prisma";

export interface IRequestUser {
  userId : string;
  role : Role,
  email : string
}

export interface IRegisterMemberPayload {
  name : string,
  email : string,
  password : string,
  role ?: string,
  image ?: string
}

export interface ILoginUserPayload {
  email : string,
  password : string
}

export interface IChangePassword {
  currentPassword : string,
  newPassword : string
}