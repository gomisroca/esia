/*
  Warnings:

  - You are about to drop the `_ArtworkToExhibition` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "_ArtworkToExhibition" DROP CONSTRAINT "_ArtworkToExhibition_A_fkey";

-- DropForeignKey
ALTER TABLE "_ArtworkToExhibition" DROP CONSTRAINT "_ArtworkToExhibition_B_fkey";

-- DropTable
DROP TABLE "_ArtworkToExhibition";
