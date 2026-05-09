import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { Role, UserStatus } from "../../generated/prisma";
import { prisma } from "./prisma";

export const auth = betterAuth({
    database: prismaAdapter(prisma, {
        provider: "postgresql",
    }),

    emailAndPassword : {
        enabled : true,
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
    }
});