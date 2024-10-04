/*
  Warnings:

  - You are about to drop the `UserArtwork` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "UserArtwork" DROP CONSTRAINT "UserArtwork_artworkId_fkey";

-- DropForeignKey
ALTER TABLE "UserArtwork" DROP CONSTRAINT "UserArtwork_userId_fkey";

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "admin" BOOLEAN NOT NULL DEFAULT false;

-- DropTable
DROP TABLE "UserArtwork";
