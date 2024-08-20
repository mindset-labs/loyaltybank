/*
  Warnings:

  - The values [SIMPLE] on the enum `AchievementRewardType` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "AchievementRewardType_new" AS ENUM ('POINTS', 'COUPON', 'BADGE', 'COMPLEX');
ALTER TABLE "Achievement" ALTER COLUMN "rewardType" DROP DEFAULT;
ALTER TABLE "Achievement" ALTER COLUMN "rewardType" TYPE "AchievementRewardType_new" USING ("rewardType"::text::"AchievementRewardType_new");
ALTER TYPE "AchievementRewardType" RENAME TO "AchievementRewardType_old";
ALTER TYPE "AchievementRewardType_new" RENAME TO "AchievementRewardType";
DROP TYPE "AchievementRewardType_old";
ALTER TABLE "Achievement" ALTER COLUMN "rewardType" SET DEFAULT 'POINTS';
COMMIT;

-- AlterTable
ALTER TABLE "Achievement" ALTER COLUMN "rewardType" SET DEFAULT 'POINTS';
