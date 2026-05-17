
import status from "http-status";
import AppError from "../../errorHelpers/AppError";
import { prisma } from "../../lib/prisma";
import { UserStatus, Prisma } from "../../../generated/prisma";

const getAllMembersFromDB = async () => {
  const result = await prisma.member.findMany({
    where: {
      isDeleted: false,
    },
    include: {
      user: true,
    },
  });
  return result;
};

const getMemberByIdFromDB = async (id: string) => {
  const result = await prisma.member.findUnique({
    where: {
      id,
      isDeleted: false,
    },
    include: {
      user: true,
    },
  });
  return result;
};

const updateMemberInDB = async (id: string, payload: Prisma.MemberUncheckedUpdateInput) => {
  const memberData = await prisma.member.findUnique({
    where: {
      id,
    },
  });

  if(!memberData){
    throw new AppError(status.NOT_FOUND,"Member is not Found")
  }

  await prisma.user.update({
    where : {
      id : memberData.userId
    },
    data : payload
  })
  const result = await prisma.member.update({
    where : {
      id
    },
    data : payload
  })
  return result;
};

const deleteMemberFromDB = async (id: string) => {
  const result = await prisma.$transaction(async (tx) => {
    const member = await tx.member.findUnique({
      where : {
        id
      }
    })

    if(!member){
      throw new AppError(status.NOT_FOUND, "Member is not Exists");
    }
    const user = await tx.user.findUnique({
      where: {
        id : member.userId
      },
    });

    if (!user) {
      throw new AppError(status.NOT_FOUND, "Admin not found");
    }

    await tx.user.update({
      where: {
        id: member.userId,
      },
      data: {
        isDeleted: true,
        status : UserStatus.DELETED
      },
    });
    await tx.member.delete({
      where : {
        id
      }
    })

    return user;
  });
  return result;
};

const getMemberChallengesFromDB = async (memberId: string) => {
  const result = await prisma.memberChallenge.findMany({
    where: {
      memberId,
    },
    include: {
      challenge: true,
    },
  });
  return result;
};

const getMemberSubmissionsFromDB = async (memberId: string) => {
  const result = await prisma.submission.findMany({
    where: {
      memberId,
    },
    include: {
      challenge: true,
    },
  });
  return result;
};

const getMemberPaymentsFromDB = async (memberId: string) => {
  const result = await prisma.payment.findMany({
    where: {
      memberChallenge: {
        memberId,
      },
    },
  });
  return result;
};

const getMemberStatsFromDB = async (userId: string) => {
  // Find member by userId
  const member = await prisma.member.findUnique({
    where: { userId, isDeleted: false },
  });

  if (!member) {
    throw new AppError(status.NOT_FOUND, "Member not found");
  }

  const memberId = member.id;

  // Total points
  const totalPoints = member.totalPoints;

  // Active challenges count: challenges where memberChallenge exists and challenge.status == ACTIVE
  const activeChallengesCount = await prisma.memberChallenge.count({
    where: {
      memberId,
      challenge: {
        status: 'ACTIVE'
      }
    }
  });

  // Rank: number of members with higher points +1
  const higherPointsCount = await prisma.member.count({
    where: {
      totalPoints: {
        gt: totalPoints
      },
      isDeleted: false
    }
  });

  const rank = higherPointsCount + 1;

  const streak = await prisma.submission.count({
    where: {
      memberId,
    },
  });

  const memberChallengeStatus = await prisma.memberChallenge.findMany({
    where : {
      memberId : memberId
    }
  })

  return {
    totalPoints,
    activeStreak: streak,
    activeChallengesCount,
    rank,
    memberChallengeStatus
  };
};

export const MemberServices = {
  getAllMembersFromDB,
  getMemberByIdFromDB,
  updateMemberInDB,
  deleteMemberFromDB,
  getMemberChallengesFromDB,
  getMemberSubmissionsFromDB,
  getMemberPaymentsFromDB,
  getMemberStatsFromDB,
};
