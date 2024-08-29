-- DropForeignKey
ALTER TABLE "Artwork" DROP CONSTRAINT "Artwork_authorId_fkey";

-- AlterTable
ALTER TABLE "Artwork" ALTER COLUMN "authorId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "Artwork" ADD CONSTRAINT "Artwork_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "Author"("id") ON DELETE SET NULL ON UPDATE CASCADE;
