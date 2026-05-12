import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { Role, UserStatus } from "../../generated/prisma";
import { prisma } from "./prisma";
import { bearer, emailOTP } from "better-auth/plugins";
import { sendEmail } from "../utils/email";
import { envVars } from "../../config/env";

export const auth = betterAuth({
    baseURL : envVars.BETTER_AUTH_URL,
    secret : envVars.BETTER_AUTH_SECRET,
    database: prismaAdapter(prisma, {
        provider: "postgresql",
    }),

    emailAndPassword : {
        enabled : true,
    },

    socialProviders : {
        google : {
            clientId : envVars.GOOGLE_CLIENT_ID,
            clientSecret : envVars.GOOGLE_CLIENT_SECRET,
        
            mapProfileToUser: () => {
                return {
                    role : Role.MEMBER,
                    status : UserStatus.ACTIVE,
                    needPasswordChange : false,
                    emailVerified : true,
                    isDeleted : false,
                    deletedAt : null,
                }
            }
        }
    },


    emailVerification : {
        sendOnSignUp : true,
        sendOnSignIn : true,
        autoSignInAfterVerification : true
    },

    user : {
        additionalFields : {
            role : {
                type : "string",
                required : false,
                defaultValue : Role.MEMBER
            },
            status : {
                type : "string",
                required : false,
                defaultValue : UserStatus.ACTIVE
            },
            needPasswordChange : {
                type : "boolean",
                required : false,
                defaultValue : true
            },
            isDeleted : {
                type : "boolean",
                required : false,
                defaultValue : false
            },
            deletedAt : {
                type : "date",
                required : false,
                defaultValue : null
            }
        }
    },

    plugins : [
    bearer(),
      emailOTP({
        overrideDefaultEmailVerification : true,
        async sendVerificationOTP({email, otp, type}){
          if(type==='email-verification'){
            const user = await prisma.user.findUnique({
              where : {
                email
              }
            })


          if(user && !user.emailVerified){
            sendEmail({
              to: email,
              subject : "Verify your Email",
              templateName : "otp",
              templateData : {
                name : user.name,
                otp
              }
            })
          }
          }
          else if(type==="forget-password"){
            const user = await prisma.user.findUnique({
                where : {
                    email
                }
            })

            if(user){
                sendEmail({
                    to : email,
                    subject : "Password Reset OTP",
                    templateName : "otp",
                    templateData : {
                        name : user.name,
                        otp,
                    }
                })
            }
          }
        },
        expiresIn : 2 * 60, // 2 min in seconds
        otpLength : 6,
      })
    ],


    session : {
        expiresIn : 60*60*24*100,
        updateAge : 60*60*24*100,
        cookieCache : {
            enabled : true,
            maxAge : 60*60*24*100
        }
    },

    redirectURLs : {
        signIn : `${envVars.BETTER_AUTH_URL}/api/v1/auth/google/success`
    },

    trustedOrigins: [process.env.BETTER_AUTH_URL || "http://localhost:5000", envVars.FRONTEND_URL],

    advanced : {
        useSecureCookies : false,
        cookies : {
            state : {
                attributes : {
                    sameSite : "none",
                    secure : true,
                    httpOnly : true,
                    path : "/"
                }
            },
            sessionToken : {
                attributes : {
                    sameSite : "none",
                    secure : true,
                    httpOnly : true,
                    path : "/"
                }
            }
        }
    }
});