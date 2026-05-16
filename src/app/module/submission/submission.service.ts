/* eslint-disable @typescript-eslint/no-explicit-any */
import status from "http-status";
import { Prisma, Submission, Role } from "../../../generated/prisma";
import { prisma } from "../../lib/prisma";
import AppError from "../../errorHelpers/AppError";
import { QueryBuilder } from "../../utils/QueryBuilder";
import { IQueryParams } from "../../interfaces/query.interface";
import { ISubmissionCreateInput } from "./submission.interface";

const createSubmission = async (payload: ISubmissionCreateInput, userId : string) => {
  const member = await prisma.member.findUnique({
    where : {
      userId
    }
  })

  if(!member) {
    throw new AppError(status.NOT_FOUND, "Member does not exist");
  }

  const challenge = await prisma.challenge.findUnique({
    where: {
      id: payload.challengeId,
    },
  });

  if (!challenge) {
    throw new AppError(status.NOT_FOUND, "Challenge does not exist");
  }

  // Get start and end of today to check for duplicate submissions
  const todayStart = new Date();
  todayStart.setHours(0, 0, 0, 0);

  const todayEnd = new Date();
  todayEnd.setHours(23, 59, 59, 999);

  const existingSubmission = await prisma.submission.findFirst({
    where: {
      memberId: member.id,
      memberChallengeId: payload.memberChallengeId,
      submittedDate: {
        gte: todayStart,
        lte: todayEnd,
      },
    },
  });

  if (existingSubmission) {
    throw new AppError(status.CONFLICT, "You have already submitted for this challenge today.");
  }

  const result = await prisma.$transaction(async (tx) => {
    const newSubmission = await tx.submission.create({
      data: {
        ...payload,
        memberId: member.id,
      } as Prisma.SubmissionUncheckedCreateInput,
    });

    await tx.memberChallenge.update({
      where : {
        id : payload.memberChallengeId
      },
      data : {
        pointsAchieved : {
          increment : challenge.pointsPerDay
        }
      }
    })

    return newSubmission;
  });

  return result;
};

const getAllSubmissions = async (queryParams: IQueryParams) => {
  const submissionQueryBuilder = new QueryBuilder(prisma.submission, queryParams, {
    searchableFields: ["feedBack"],
    filterableFields: ["status", "memberId", "challengeId", "memberChallengeId"],
  });

  return await submissionQueryBuilder
    .search()
    .filter()
    .sort()
    .paginate()
    .include({ member: true, challenge: true, memberChallenge: true })
    .execute();
};

const getSubmissionById = async (id: string) => {
  const submission = await prisma.submission.findUnique({
    where: { id },
    include: { member: true, challenge: true, memberChallenge: true },
  });

  if (!submission) {
    throw new AppError(status.NOT_FOUND, "Submission not found");
  }

  return submission;
};

const getSubmissionsByMemberId = async (memberId: string) => {
  const result = await prisma.submission.findMany({
    where : {
      memberId
    },
    include : {
      challenge: true,
      memberChallenge: true
    }
  })

  // Map the data to include the requested fields
  const mappedResult = result.map(submission => ({
    id: submission.id,
    ChallengeName: submission.challenge?.title,
    SubmissionDate: submission.submittedDate,
    Status: submission.status,
    PointsAchieved: submission.memberChallenge?.pointsAchieved || 0,
    feedBack: submission.feedBack,
    proofs: submission.proofs
  }))

  return mappedResult;
};

const getSubmissionsByChallengeId = async (challengeId: string, queryParams: IQueryParams) => {
  queryParams.challengeId = challengeId;
  return getAllSubmissions(queryParams);
};

const updateSubmissionInDB = async (id: string, payload: Partial<Submission>, user: any) => {
  const submission = await prisma.submission.findUnique({ where: { id } });

  if (!submission) {
    throw new AppError(status.NOT_FOUND, "Submission not found");
  }

  if (user.role === Role.MEMBER) {
    const member = await prisma.member.findUnique({ where: { userId: user.userId } });
    if (submission.memberId !== member?.id) {
      throw new AppError(status.FORBIDDEN, "You are not authorized to update this submission");
    }
  }

  return await prisma.submission.update({
    where: { id },
    data: payload,
  });
};

const deleteSubmission = async (id: string) => {
  const isSubmissionExists = await prisma.submission.findUnique({ where: { id } });

  if (!isSubmissionExists) {
    throw new AppError(status.NOT_FOUND, "Submission not found");
  }

  return await prisma.submission.delete({
    where: { id },
  });
};

export const SubmissionService = {
  createSubmission,
  getAllSubmissions,
  getSubmissionById,
  getSubmissionsByMemberId,
  getSubmissionsByChallengeId,
  updateSubmissionInDB,
  deleteSubmission,
};
