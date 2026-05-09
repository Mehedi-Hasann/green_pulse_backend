
import { Role } from "../../../generated/prisma";
import { auth } from "../../lib/auth";
import { prisma } from "../../lib/prisma";

interface IRegisterMemberPayload {
  name : string,
  email : string,
  password : string,
  role ?: string,
  image ?: string
}

const registerMember = async(payload : IRegisterMemberPayload) => {
  console.log(payload);
  const {name, email,password} = payload;

  const data = await auth.api.signUpEmail({
    body : {
      name,
      email,
      password,
      role : Role.MEMBER
    }
  })
console.log(data);
  if(!data.user){
    throw new Error("Failed to register User");
  }

  const member = await prisma.$transaction(async(tx) => {

    const memberTx = await tx.member.create({
      data : {
        userId : data.user.id,
        name : data.user.name,
        email : data.user.email
      }
    })

    // return memberTx;
  })
  return {
    ...data,
    member,
  };
}


export const AuthServices = {
  registerMember
}