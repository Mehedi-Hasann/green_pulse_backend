import { z } from "zod";

const joinChallengeSchema = z.object({
  challengeId: z.string("Challenge ID is required"),
});

const updateMemberChallengeSchema = z.object({
  isVerified: z.boolean().optional(),
  pointsAchieved: z.number().int().nonnegative().optional(),
});

export const MemberChallengeValidations = {
  joinChallengeSchema,
  updateMemberChallengeSchema,
};
