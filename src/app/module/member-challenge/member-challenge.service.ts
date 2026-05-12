import status from "http-status";
import { IQueryParams } from "../../interfaces/query.interface";
import AppError from "../../errorHelpers/AppError";
import { prisma } from "../../lib/prisma";
import { QueryBuilder } from "../../utils/QueryBuilder";

const SEARCHABLE_FIELDS = ["challenge.title", "member.name"];
const FILTERABLE_FIELDS = ["memberId", "challengeId", "isVerified"];

const CreateMemberChallenge = async (userId: string, challengeId: string) => {

  const user = await prisma.user.findFirst({ 
    where: { 
      id: userId,   
    },
    include : {
        member : true
      }
  });
  if(!user?.member){
    throw new AppError(status.NOT_FOUND, "User is not Exits")
  }
  const member = await prisma.member.findUnique({
    where : {
      id : user?.member.id
    }
  })
  if(!member){
    throw new AppError(status.NOT_FOUND, "Member is not Exits")
  }
  const memberId = member?.id;
  if (!member || member.isDeleted) {
    throw new AppError(status.NOT_FOUND, "Member not found");
  }

  const challenge = await prisma.challenge.findUnique({ where: { id: challengeId } });
  if (!challenge) {
    throw new AppError(status.NOT_FOUND, "Challenge not found");
  }

  const alreadyJoined = await prisma.memberChallenge.findUnique({
    where: { memberId_challengeId: { memberId, challengeId } },
  });

  if (alreadyJoined) {
    throw new AppError(status.CONFLICT, "Member has already joined this challenge");
  }

  const result = await prisma.memberChallenge.create({
    data: { memberId, challengeId },
    include: {
      member: true,
      challenge: { include: { category: true } },
    },
  });

  return result;
};

const getAllMemberChallenges = async (queryParams: IQueryParams) => {
  const builder = new QueryBuilder(prisma.memberChallenge, queryParams, {
    searchableFields: SEARCHABLE_FIELDS,
    filterableFields: FILTERABLE_FIELDS,
  });

  const result = await builder
    .search()
    .filter()
    .sort()
    .paginate()
    .include({
      member: true,
      challenge: { include: { category: true } },
    })
    .execute();

  return result;
};

const getSingleMemberChallenge = async (id: string) => {
  const result = await prisma.memberChallenge.findUnique({
    where: { id },
    include: {
      member: true,
      challenge: { include: { category: true } },
      submission: true,
      payment: true,
    },
  });

  if (!result) {
    throw new AppError(status.NOT_FOUND, "Member challenge record not found");
  }

  return result;
};

const getMemberChallengesByMemberId = async (memberId: string, queryParams: IQueryParams) => {
  const member = await prisma.member.findUnique({ where: { id: memberId } });
  if (!member) {
    throw new AppError(status.NOT_FOUND, "Member not found");
  }

  const builder = new QueryBuilder(prisma.memberChallenge, queryParams, {
    searchableFields: ["challenge.title"],
    filterableFields: ["isVerified", "challengeId"],
  });

  const result = await builder
    .search()
    .filter()
    .sort()
    .paginate()
    .where({ memberId })
    .include({
      challenge: { include: { category: true } },
      submission: true,
    })
    .execute();

  return result;
};

const updateMemberChallengeByMemberChallengeId = async (
  id: string,
  payload: { isVerified?: boolean; pointsAchieved?: number }
) => {
  const existing = await prisma.memberChallenge.findUnique({ where: { id } });

  if (!existing) {
    throw new AppError(status.NOT_FOUND, "Member challenge record not found");
  }

  // If verifying for first time + points provided → update member totalPoints in transaction
  if (payload.isVerified && !existing.isVerified && payload.pointsAchieved) {
    const result = await prisma.$transaction(async (tx) => {
      const updated = await tx.memberChallenge.update({
        where: { id },
        data: payload,
        include: { member: true, challenge: true },
      });

      await tx.member.update({
        where: { id: existing.memberId },
        data: { totalPoints: { increment: payload.pointsAchieved ?? 0 } },
      });

      return updated;
    });
    return result;
  }

  const result = await prisma.memberChallenge.update({
    where: { id },
    data: payload,
    include: { member: true, challenge: true },
  });

  return result;
};

const deleteMemberChallenge = async (id: string) => {
  const existing = await prisma.memberChallenge.findUnique({ where: { id } });

  if (!existing) {
    throw new AppError(status.NOT_FOUND, "Member challenge record not found");
  }

  const result = await prisma.memberChallenge.delete({ where: { id } });

  return result;
};

export const MemberChallengeService = {
  CreateMemberChallenge,
  getAllMemberChallenges,
  getSingleMemberChallenge,
  getMemberChallengesByMemberId,
  updateMemberChallengeByMemberChallengeId,
  deleteMemberChallenge,
};
