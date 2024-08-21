/*
  Warnings:

  - The values [COMPLEX] on the enum `AchievementRewardType` will be removed. If these variants are still used in the database, this will fail.
  - You are about to drop the column `conditionMaxValue` on the `Achievement` table. All the data in the column will be lost.
  - You are about to drop the column `conditionMinValue` on the `Achievement` table. All the data in the column will be lost.
  - You are about to drop the column `conditionType` on the `Achievement` table. All the data in the column will be lost.
  - You are about to drop the column `conditionValue` on the `Achievement` table. All the data in the column will be lost.
  - Added the required column `conditionEventAggregateType` to the `Achievement` table without a default value. This is not possible if the table is not empty.
  - Added the required column `conditionEventComparisonType` to the `Achievement` table without a default value. This is not possible if the table is not empty.
  - Made the column `conditionEventId` on table `Achievement` required. This step will fail if there are existing NULL values in that column.
  - Made the column `conditionEventValue` on table `Achievement` required. This step will fail if there are existing NULL values in that column.
  - Made the column `value` on table `EventLog` required. This step will fail if there are existing NULL values in that column.

*/
-- CreateEnum
CREATE TYPE "AchievementConditionComparisionType" AS ENUM ('EQUAL', 'GREATER_THAN', 'GREATER_THAN_OR_EQUAL', 'LESS_THAN', 'LESS_THAN_OR_EQUAL', 'NOT_EQUAL', 'CUSTOM');

-- CreateEnum
CREATE TYPE "AchievementConditionAggregateType" AS ENUM ('SUM', 'COUNT', 'AVG', 'MIN', 'MAX', 'CUSTOM');

-- AlterEnum
BEGIN;
CREATE TYPE "AchievementRewardType_new" AS ENUM ('POINTS', 'POINTS_CUSTOM', 'COUPON', 'BADGE');
ALTER TABLE "Achievement" ALTER COLUMN "rewardType" DROP DEFAULT;
ALTER TABLE "Achievement" ALTER COLUMN "rewardType" TYPE "AchievementRewardType_new" USING ("rewardType"::text::"AchievementRewardType_new");
ALTER TYPE "AchievementRewardType" RENAME TO "AchievementRewardType_old";
ALTER TYPE "AchievementRewardType_new" RENAME TO "AchievementRewardType";
DROP TYPE "AchievementRewardType_old";
ALTER TABLE "Achievement" ALTER COLUMN "rewardType" SET DEFAULT 'POINTS';
COMMIT;

-- DropForeignKey
ALTER TABLE "Achievement" DROP CONSTRAINT "Achievement_conditionEventId_fkey";

-- AlterTable
ALTER TABLE "Achievement" DROP COLUMN "conditionMaxValue",
DROP COLUMN "conditionMinValue",
DROP COLUMN "conditionType",
DROP COLUMN "conditionValue",
ADD COLUMN     "conditionEventAggregateType" "AchievementConditionAggregateType" NOT NULL,
ADD COLUMN     "conditionEventComparisonType" "AchievementConditionComparisionType" NOT NULL,
ADD COLUMN     "conditionEventCountLimit" INTEGER,
ADD COLUMN     "conditionRawEvaluator" TEXT,
ALTER COLUMN "conditionEventId" SET NOT NULL,
ALTER COLUMN "conditionEventValue" SET NOT NULL;

-- AlterTable
ALTER TABLE "EventLog" ALTER COLUMN "value" SET NOT NULL,
ALTER COLUMN "value" SET DEFAULT 0;

-- DropEnum
DROP TYPE "AchievementConditionType";

-- AddForeignKey
ALTER TABLE "Achievement" ADD CONSTRAINT "Achievement_conditionEventId_fkey" FOREIGN KEY ("conditionEventId") REFERENCES "Event"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
