-- CreateEnum
CREATE TYPE "InviteStatus" AS ENUM ('OPEN', 'CLOSED');

-- AlterEnum
ALTER TYPE "CommunityRole" ADD VALUE 'MANAGED_MEMBER';

-- CreateTable
CREATE TABLE "Invite" (
    "id" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "email" TEXT,
    "communityId" TEXT NOT NULL,
    "walletId" TEXT,
    "inviteById" TEXT NOT NULL,
    "status" "InviteStatus" NOT NULL DEFAULT 'OPEN',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "expiresAt" TIMESTAMP(3),
    "maxUses" INTEGER DEFAULT 999,
    "uses" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "Invite_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Invite_code_key" ON "Invite"("code");

-- AddForeignKey
ALTER TABLE "Invite" ADD CONSTRAINT "Invite_communityId_fkey" FOREIGN KEY ("communityId") REFERENCES "Community"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Invite" ADD CONSTRAINT "Invite_inviteById_fkey" FOREIGN KEY ("inviteById") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
