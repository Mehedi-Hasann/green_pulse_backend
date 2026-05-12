import { ChallengeStatus } from "../../../generated/prisma";

export interface ICreateChallengePayload {
  categoryId : string;
  title : string;
  description : string;
  duration : number;
  pointsPerDay : number;
  isPaid ?: boolean;
  price ?: number;
  status ?: ChallengeStatus;
}
export interface IUpdateChallengePayload {
  categoryId ?: string;
  title ?: string;
  description ?: string;
  duration ?: number;
  pointsPerDay ?: number;
  isPaid ?: boolean;
  price ?: number;
  status ?: ChallengeStatus;
}