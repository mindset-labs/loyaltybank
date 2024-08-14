-- CreateEnum
CREATE TYPE "WalletRole" AS ENUM ('OWNER', 'ADMIN', 'MEMBER');

-- AlterTable
ALTER TABLE "Wallet" ADD COLUMN     "isShared" BOOLEAN NOT NULL DEFAULT false;

-- CreateTable
CREATE TABLE "UserOnWallet" (
    "userId" TEXT NOT NULL,
    "walletId" TEXT NOT NULL,
    "role" "WalletRole" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "UserOnWallet_pkey" PRIMARY KEY ("userId","walletId")
);

-- AddForeignKey
ALTER TABLE "UserOnWallet" ADD CONSTRAINT "UserOnWallet_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserOnWallet" ADD CONSTRAINT "UserOnWallet_walletId_fkey" FOREIGN KEY ("walletId") REFERENCES "Wallet"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
