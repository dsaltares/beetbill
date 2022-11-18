/*
  Warnings:

  - You are about to drop the column `firstName` on the `ClientState` table. All the data in the column will be lost.
  - You are about to drop the column `lastName` on the `ClientState` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "ClientState" DROP COLUMN "firstName",
DROP COLUMN "lastName",
ADD COLUMN     "contactName" TEXT;
