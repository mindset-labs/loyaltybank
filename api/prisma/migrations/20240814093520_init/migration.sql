-- AlterTable
ALTER TABLE "UserOnWallet" ADD COLUMN     "dailyLimit" DOUBLE PRECISION,
ADD COLUMN     "metadata" JSONB,
ADD COLUMN     "monthlyLimit" DOUBLE PRECISION,
ADD COLUMN     "weeklyLimit" DOUBLE PRECISION;
