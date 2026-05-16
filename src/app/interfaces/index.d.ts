import { Role } from "../../generated/prisma";

export {};

declare global {
  namespace Express {
    interface Request {
      user: {
        userId: string;
        role: Role;
        email: string;
      };
    }
  }
}