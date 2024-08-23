/*
  Warnings:

  - You are about to drop the column `secret` on the `ApiKey` table. All the data in the column will be lost.
  - Made the column `communityId` on table `Achievement` required. This step will fail if there are existing NULL values in that column.
  - Made the column `communityId` on table `Event` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "Achievement" DROP CONSTRAINT "Achievement_communityId_fkey";

-- DropForeignKey
ALTER TABLE "Event" DROP CONSTRAINT "Event_communityId_fkey";

-- AlterTable
ALTER TABLE "Achievement" ALTER COLUMN "communityId" SET NOT NULL;

-- AlterTable
ALTER TABLE "ApiKey" DROP COLUMN "secret";

-- AlterTable
ALTER TABLE "Event" ALTER COLUMN "communityId" SET NOT NULL;

-- AddForeignKey
ALTER TABLE "Achievement" ADD CONSTRAINT "Achievement_communityId_fkey" FOREIGN KEY ("communityId") REFERENCES "Community"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Event" ADD CONSTRAINT "Event_communityId_fkey" FOREIGN KEY ("communityId") REFERENCES "Community"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
