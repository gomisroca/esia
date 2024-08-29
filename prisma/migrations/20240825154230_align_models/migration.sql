/*
  Warnings:

  - You are about to drop the column `authorId` on the `Artwork` table. All the data in the column will be lost.
  - You are about to drop the column `description` on the `Artwork` table. All the data in the column will be lost.
  - You are about to drop the column `name` on the `Artwork` table. All the data in the column will be lost.
  - You are about to drop the column `placeOfOrigin` on the `Artwork` table. All the data in the column will be lost.
  - You are about to drop the column `year` on the `Artwork` table. All the data in the column will be lost.
  - You are about to drop the column `endDate` on the `Exhibition` table. All the data in the column will be lost.
  - You are about to drop the column `startDate` on the `Exhibition` table. All the data in the column will be lost.
  - You are about to drop the column `authorId` on the `Style` table. All the data in the column will be lost.
  - You are about to drop the `Author` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Ticket` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_ArtworkToExhibition` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_ArtworkToStyle` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_AuthorToExhibition` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `artistId` to the `Artwork` table without a default value. This is not possible if the table is not empty.
  - Added the required column `title` to the `Artwork` table without a default value. This is not possible if the table is not empty.
  - Added the required column `end` to the `Exhibition` table without a default value. This is not possible if the table is not empty.
  - Added the required column `start` to the `Exhibition` table without a default value. This is not possible if the table is not empty.
  - Added the required column `url` to the `Exhibition` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Artwork" DROP CONSTRAINT "Artwork_authorId_fkey";

-- DropForeignKey
ALTER TABLE "Style" DROP CONSTRAINT "Style_authorId_fkey";

-- DropForeignKey
ALTER TABLE "Ticket" DROP CONSTRAINT "Ticket_exhibitionId_fkey";

-- DropForeignKey
ALTER TABLE "_ArtworkToExhibition" DROP CONSTRAINT "_ArtworkToExhibition_A_fkey";

-- DropForeignKey
ALTER TABLE "_ArtworkToExhibition" DROP CONSTRAINT "_ArtworkToExhibition_B_fkey";

-- DropForeignKey
ALTER TABLE "_ArtworkToStyle" DROP CONSTRAINT "_ArtworkToStyle_A_fkey";

-- DropForeignKey
ALTER TABLE "_ArtworkToStyle" DROP CONSTRAINT "_ArtworkToStyle_B_fkey";

-- DropForeignKey
ALTER TABLE "_AuthorToExhibition" DROP CONSTRAINT "_AuthorToExhibition_A_fkey";

-- DropForeignKey
ALTER TABLE "_AuthorToExhibition" DROP CONSTRAINT "_AuthorToExhibition_B_fkey";

-- AlterTable
ALTER TABLE "Artwork" DROP COLUMN "authorId",
DROP COLUMN "description",
DROP COLUMN "name",
DROP COLUMN "placeOfOrigin",
DROP COLUMN "year",
ADD COLUMN     "artistId" TEXT NOT NULL,
ADD COLUMN     "date" TEXT,
ADD COLUMN     "image" TEXT,
ADD COLUMN     "medium" TEXT,
ADD COLUMN     "origin" TEXT,
ADD COLUMN     "styleId" TEXT,
ADD COLUMN     "title" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Exhibition" DROP COLUMN "endDate",
DROP COLUMN "startDate",
ADD COLUMN     "end" TEXT NOT NULL,
ADD COLUMN     "start" TEXT NOT NULL,
ADD COLUMN     "url" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Style" DROP COLUMN "authorId";

-- DropTable
DROP TABLE "Author";

-- DropTable
DROP TABLE "Ticket";

-- DropTable
DROP TABLE "_ArtworkToExhibition";

-- DropTable
DROP TABLE "_ArtworkToStyle";

-- DropTable
DROP TABLE "_AuthorToExhibition";

-- CreateTable
CREATE TABLE "Artist" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "birth" INTEGER,
    "death" INTEGER,
    "description" TEXT,

    CONSTRAINT "Artist_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Artwork" ADD CONSTRAINT "Artwork_artistId_fkey" FOREIGN KEY ("artistId") REFERENCES "Artist"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Artwork" ADD CONSTRAINT "Artwork_styleId_fkey" FOREIGN KEY ("styleId") REFERENCES "Style"("id") ON DELETE SET NULL ON UPDATE CASCADE;
