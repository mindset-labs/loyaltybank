-- CreateEnum
CREATE TYPE "CommunityStatus" AS ENUM ('DRAFT', 'ACTIVE', 'INACTIVE', 'ARCHIVED');

-- AlterTable
ALTER TABLE "Community" ADD COLUMN     "imageUrl" TEXT,
ADD COLUMN     "isPublic" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "metadata" JSONB,
ADD COLUMN     "status" "CommunityStatus" NOT NULL DEFAULT 'DRAFT';

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "resetPasswordToken" TEXT;
