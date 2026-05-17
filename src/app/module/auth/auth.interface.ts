import { Role, UserStatus } from "../../../generated/prisma";

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

export interface IGoogleSession {
  user: {
    id: string;
    name: string;
    role: Role;
    email: string;
    status: UserStatus;
    isDeleted: boolean;
    emailVerified: boolean;
    [key: string]: unknown;
  };
  [key: string]: unknown;
}