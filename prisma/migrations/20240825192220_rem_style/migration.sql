/*
  Warnings:

  - You are about to drop the column `styleId` on the `Artwork` table. All the data in the column will be lost.
  - You are about to drop the `Style` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Artwork" DROP CONSTRAINT "Artwork_styleId_fkey";

-- AlterTable
ALTER TABLE "Artwork" DROP COLUMN "styleId";

-- DropTable
DROP TABLE "Style";
