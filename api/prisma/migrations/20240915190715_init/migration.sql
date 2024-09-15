-- AlterTable
ALTER TABLE "Invite" ADD COLUMN     "membershipId" TEXT;

-- AlterTable
ALTER TABLE "Membership" ADD COLUMN     "inviteId" TEXT;

-- AddForeignKey
ALTER TABLE "Membership" ADD CONSTRAINT "Membership_inviteId_fkey" FOREIGN KEY ("inviteId") REFERENCES "Invite"("id") ON DELETE SET NULL ON UPDATE CASCADE;
