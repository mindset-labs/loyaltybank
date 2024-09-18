/*
  Warnings:

  - You are about to drop the column `phoneNumberCode` on the `User` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "User" DROP COLUMN "phoneNumberCode",
ADD COLUMN     "phoneNumber2FACode" TEXT;
