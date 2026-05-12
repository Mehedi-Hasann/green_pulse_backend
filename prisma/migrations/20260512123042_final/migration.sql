/*
  Warnings:

  - The `price` column on the `challenge` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - You are about to drop the column `email` on the `member` table. All the data in the column will be lost.
  - Changed the type of `duration` on the `challenge` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `pointsPerDay` on the `challenge` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateEnum
CREATE TYPE "SubmissionStatus" AS ENUM ('PENDING', 'APPROVED', 'REJECTED');

-- CreateEnum
CREATE TYPE "PaymentStatus" AS ENUM ('PENDING', 'PAID', 'FAILED', 'REFUNDED');

-- DropIndex
DROP INDEX "challenge_categoryId_key";

-- DropIndex
DROP INDEX "member_email_key";

-- AlterTable
ALTER TABLE "challenge" DROP COLUMN "duration",
ADD COLUMN     "duration" INTEGER NOT NULL,
DROP COLUMN "pointsPerDay",
ADD COLUMN     "pointsPerDay" INTEGER NOT NULL,
DROP COLUMN "price",
ADD COLUMN     "price" DOUBLE PRECISION;

-- AlterTable
ALTER TABLE "member" DROP COLUMN "email";

-- CreateTable
CREATE TABLE "member_challenge" (
    "id" TEXT NOT NULL,
    "memberId" TEXT NOT NULL,
    "challengeId" TEXT NOT NULL,
    "isVerified" BOOLEAN NOT NULL DEFAULT false,
    "pointsAchieved" INTEGER NOT NULL DEFAULT 0,
    "joinedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "member_challenge_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "payment" (
    "id" TEXT NOT NULL,
    "memberChallengeId" TEXT NOT NULL,
    "amount" DOUBLE PRECISION NOT NULL,
    "transactionId" TEXT NOT NULL,
    "status" "PaymentStatus" NOT NULL DEFAULT 'PENDING',
    "paidAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "payment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "submission" (
    "id" TEXT NOT NULL,
    "memberChallengeId" TEXT NOT NULL,
    "submittedDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "memberId" TEXT NOT NULL,
    "challengeId" TEXT NOT NULL,
    "proofs" TEXT[],
    "status" "SubmissionStatus" NOT NULL DEFAULT 'PENDING',
    "feedBack" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "submission_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "member_challenge_memberId_challengeId_key" ON "member_challenge"("memberId", "challengeId");

-- CreateIndex
CREATE UNIQUE INDEX "payment_memberChallengeId_key" ON "payment"("memberChallengeId");

-- CreateIndex
CREATE UNIQUE INDEX "payment_transactionId_key" ON "payment"("transactionId");

-- CreateIndex
CREATE UNIQUE INDEX "submission_memberId_memberChallengeId_submittedDate_key" ON "submission"("memberId", "memberChallengeId", "submittedDate");

-- AddForeignKey
ALTER TABLE "member_challenge" ADD CONSTRAINT "member_challenge_memberId_fkey" FOREIGN KEY ("memberId") REFERENCES "member"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "member_challenge" ADD CONSTRAINT "member_challenge_challengeId_fkey" FOREIGN KEY ("challengeId") REFERENCES "challenge"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "payment" ADD CONSTRAINT "payment_memberChallengeId_fkey" FOREIGN KEY ("memberChallengeId") REFERENCES "member_challenge"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "submission" ADD CONSTRAINT "submission_memberChallengeId_fkey" FOREIGN KEY ("memberChallengeId") REFERENCES "member_challenge"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "submission" ADD CONSTRAINT "submission_memberId_fkey" FOREIGN KEY ("memberId") REFERENCES "member"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "submission" ADD CONSTRAINT "submission_challengeId_fkey" FOREIGN KEY ("challengeId") REFERENCES "challenge"("id") ON DELETE CASCADE ON UPDATE CASCADE;
