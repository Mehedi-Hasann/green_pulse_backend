 export interface IUploadSubmissionProofs {
  memberChallengeId : string;
  challengeId : string;
  proofs : string[]
 }

export interface ISubmissionCreateInput{
  memberChallengeId: string,
  challengeId: string,
  proofs: string[],
  memberId?: string
}