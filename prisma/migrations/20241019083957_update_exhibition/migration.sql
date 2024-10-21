/*
  Warnings:

  - You are about to drop the column `url` on the `Exhibition` table. All the data in the column will be lost.
  - Added the required column `image` to the `Exhibition` table without a default value. This is not possible if the table is not empty.
  - Changed the type of `end` on the `Exhibition` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `start` on the `Exhibition` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "Exhibition" DROP COLUMN "url",
ADD COLUMN     "image" TEXT NOT NULL,
DROP COLUMN "end",
ADD COLUMN     "end" TIMESTAMP(3) NOT NULL,
DROP COLUMN "start",
ADD COLUMN     "start" TIMESTAMP(3) NOT NULL;

-- CreateTable
CREATE TABLE "_ArtworkToExhibition" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_ArtworkToExhibition_AB_unique" ON "_ArtworkToExhibition"("A", "B");

-- CreateIndex
CREATE INDEX "_ArtworkToExhibition_B_index" ON "_ArtworkToExhibition"("B");

-- AddForeignKey
ALTER TABLE "_ArtworkToExhibition" ADD CONSTRAINT "_ArtworkToExhibition_A_fkey" FOREIGN KEY ("A") REFERENCES "Artwork"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ArtworkToExhibition" ADD CONSTRAINT "_ArtworkToExhibition_B_fkey" FOREIGN KEY ("B") REFERENCES "Exhibition"("id") ON DELETE CASCADE ON UPDATE CASCADE;
