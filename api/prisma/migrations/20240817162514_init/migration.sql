/*
  Warnings:

  - You are about to drop the column `userId` on the `Event` table. All the data in the column will be lost.
  - You are about to drop the column `name` on the `EventLog` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[tag,communityId]` on the table `Event` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `createdById` to the `Event` table without a default value. This is not possible if the table is not empty.
  - Added the required column `tag` to the `Event` table without a default value. This is not possible if the table is not empty.
  - Added the required column `createdById` to the `EventLog` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Event" DROP CONSTRAINT "Event_userId_fkey";

-- AlterTable
ALTER TABLE "Event" DROP COLUMN "userId",
ADD COLUMN     "createdById" TEXT NOT NULL,
ADD COLUMN     "tag" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "EventLog" DROP COLUMN "name",
ADD COLUMN     "createdById" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "UserOnWallet" ALTER COLUMN "role" SET DEFAULT 'MEMBER';

-- CreateIndex
CREATE UNIQUE INDEX "Event_tag_communityId_key" ON "Event"("tag", "communityId");

-- AddForeignKey
ALTER TABLE "EventLog" ADD CONSTRAINT "EventLog_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Event" ADD CONSTRAINT "Event_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
