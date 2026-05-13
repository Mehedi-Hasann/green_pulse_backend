import { z } from "zod";
import { SubmissionStatus } from "../../../generated/prisma";

const createSubmissionSchema = z.object({
  memberChallengeId: z.string("Member Challenge ID is required" ),
  challengeId: z.string("Challenge ID is required" ),
  proofs: z.array(z.string("You must Provide Proofs for your Challenge.")),
  feedBack: z.string().optional(),
});

const updateSubmissionSchema = z.object({
  status: z.enum(SubmissionStatus).optional(),
  feedBack: z.string().optional(),
  proofs: z.array(z.string()).optional(),
});

export const SubmissionValidations = {
  createSubmissionSchema,
  updateSubmissionSchema,
};
