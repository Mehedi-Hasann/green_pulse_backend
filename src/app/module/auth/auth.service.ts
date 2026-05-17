
import status from "http-status";
import { Role } from "../../../generated/prisma";
import AppError from "../../errorHelpers/AppError";
import { auth } from "../../lib/auth";
import { prisma } from "../../lib/prisma";
import { UserStatus } from "../../../generated/prisma";
import { tokenUtils } from "../../utils/token";
import { IChangePassword, IGoogleSession, ILoginUserPayload, IRegisterMemberPayload, IRequestUser } from "./auth.interface";


const registerMember = async (payload: IRegisterMemberPayload) => {
  const { name, email, password, image, role } = payload;

  const data = await auth.api.signUpEmail({
    body: {
      name,
      email,
      password,
      role: role,
      image
    },
  });

  if (!data?.user) {
    throw new AppError(status.INTERNAL_SERVER_ERROR, "User Registration Failed");
  }

  try {
    const member = await prisma.$transaction(async (tx) => {
        if(data.user.role===Role.MEMBER){
          const memberTx = await tx.member.create({
            data: {
              userId: data.user.id,
              name: data.user.name,
              profilePhoto : data.user.image ?? null
            },
          });

          return memberTx;
        }
        if(data.user.role===Role.ADMIN){
          const adminTx = await tx.admin.create({
            data: {
              userId: data.user.id,
              name: data.user.name,
              email : data.user.email,
              profilePhoto : data.user.image ?? null
            },
          });

          return adminTx;
        }
        if(data.user.role===Role.SUPER_ADMIN){
          const superAdminTx = await tx.superAdmin.create({
            data: {
              userId: data.user.id,
              name: data.user.name,
              email : data.user.email,
              profilePhoto : data.user.image ?? null
            },
          });

          return superAdminTx;
        }
    });

    const accessToken = tokenUtils.getAccessToken({
      userId: data.user.id,
      role: data.user.role,
      name: data.user.name,
      email: data.user.email,
      status: data.user.status,
      isDeleted: data.user.isDeleted,
      emailVerified: data.user.emailVerified,
    });

    return {
      ...data,
      accessToken,
      member,
    };
  } catch (error: unknown) {
    console.log("Transaction Error : ", error);
    await prisma.user.delete({
      where: {
        id: data.user.id,
      },
    });
    throw error;
  }
};

const loginUser = async (payload: ILoginUserPayload) => {
  const { email, password } = payload;
  const data = await auth.api.signInEmail({
    body: {
      email,
      password,
    },
  });

  if (!data?.user) {
    throw new AppError(status.UNAUTHORIZED, "Invalid credentials");
  }

  if (data.user.status === UserStatus.BLOCKED) {
    throw new AppError(status.FORBIDDEN, "User is blocked");
  }

  if (data.user.isDeleted || data.user.status === UserStatus.DELETED) {
    throw new AppError(status.NOT_FOUND, "User is deleted");
  }

  const accessToken = tokenUtils.getAccessToken({
    userId: data.user.id,
    role: data.user.role,
    name: data.user.name,
    email: data.user.email,
    status: data.user.status,
    isDeleted: data.user.isDeleted,
    emailVerified: data.user.emailVerified,
  });

  return {
    ...data,
    accessToken,
  };
};

const getMe = async(user : IRequestUser) => {
  const isUserExists = await prisma.user.findUnique({
    where : {
      id : user.userId
    },
    include : {
      member : true,
      admin : true,
      superAdmin : true
    }
  })

  if(!isUserExists){
    throw new AppError(status.NOT_FOUND, "User not found");
  }

  return isUserExists;
}

const changePassword = async(payload : IChangePassword, sessionToken : string) => {
  const session = await auth.api.getSession({
    headers : new Headers({
      Authorization : `Bearer ${sessionToken}`
    })
  })

  if(!session){
    throw new AppError(status.UNAUTHORIZED, "Invalid session token");
  }

  const {currentPassword, newPassword} = payload;

  const result = await auth.api.changePassword({
    body : {
      currentPassword,
      newPassword,
      revokeOtherSessions : true,
    },
    headers : new Headers({
      Authorization : `Bearer ${sessionToken}`
    })
  })

  if(session.user.needPasswordChange){
      await prisma.user.update({
        where : {
          id : session.user.id
        },
        data : {
          needPasswordChange : false
        }
      })
  }

  return result;

}

const logoutUser = async(sessionToken : string) => {
  const result = await auth.api.signOut({
    headers : new Headers({
      Authorization : `Bearer ${sessionToken}`
    })
  })

  return result;
}

const verifyEmail = async(email : string, otp: string) => {
  const result = await auth.api.verifyEmailOTP({
    body: {
      email,
      otp
    }
  })

  if(result.status && !result.user.emailVerified){
    await prisma.user.update({
      where : {
        email
      },
      data : {
        emailVerified : true
      }
    })
  }
}

const forgetPassword = async(email : string) => {
  const isUserExists = await prisma.user.findUnique({
    where : {
      email
    }
  })

  if(!isUserExists?.emailVerified){
    throw new AppError(status.NOT_FOUND, "User not Found");
  }

  if(isUserExists.isDeleted || isUserExists.status === UserStatus.DELETED){
    throw new AppError(status.NOT_FOUND, "User not Found");
  }

  await auth.api.requestPasswordResetEmailOTP({
    body: {
      email
    }
  })
}

const resetPassword = async(email: string, otp: string, newPassword: string) => {
  const isUserExists = await prisma.user.findUnique({
    where : {
      email
    }
  })

  if(!isUserExists?.emailVerified){
    throw new AppError(status.NOT_FOUND, "User not Found");
  }

  if(isUserExists.isDeleted || isUserExists.status === UserStatus.DELETED){
    throw new AppError(status.NOT_FOUND, "User not Found");
  }

  await auth.api.resetPasswordEmailOTP({
    body : {
      email,
      otp,
      password : newPassword
    }
  })

  if(isUserExists.needPasswordChange){
    await prisma.user.update({
      where : {
        email
      },
      data : {
        needPasswordChange : false
      }
    })
  }

  await prisma.session.deleteMany({
    where : {
      userId : isUserExists.id
    }
  })
}

const getSession = async (sessionToken: string) => {
  if (!sessionToken) {
    throw new AppError(status.UNAUTHORIZED, "Invalid session token");
  }

  const session = await auth.api.getSession({
    headers: new Headers({
      Authorization: `Bearer ${sessionToken}`,
    }),
  });

  if (!session) {
    throw new AppError(status.UNAUTHORIZED, "Unable to retrieve session");
  }

  return {...session};
};

const googleLoginSuccess = async(session: IGoogleSession) => {
  console.log("Hi brother")
  const isMemberExists = await prisma.member.findUnique({
    where : {
      userId : session.user.id
    }
  })

  if(!isMemberExists){
    await prisma.member.create({
      data : {
        userId : session.user.id,
        name: session.user.name
      }
    })
  }

    const accessToken = tokenUtils.getAccessToken({
      userId: session.user.id,
      role: session.user.role,
      name: session.user.name,
      email: session.user.email,
      status: session.user.status,
      isDeleted: session.user.isDeleted,
      emailVerified: session.user.emailVerified,
    });

    return {accessToken};
    
}

export const AuthServices = {
  registerMember, loginUser, getMe, getSession, changePassword, logoutUser, verifyEmail, forgetPassword, resetPassword, googleLoginSuccess
} 