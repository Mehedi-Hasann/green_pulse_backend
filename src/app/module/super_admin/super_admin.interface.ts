import { Role } from "../../../generated/prisma";

export interface IUpdateSuperAdminPayload {
  email?: string;
  role?: Role;
  name?: string;
  profileImage?: string;
  phoneNumber?: string;
  gender?: string;
}
