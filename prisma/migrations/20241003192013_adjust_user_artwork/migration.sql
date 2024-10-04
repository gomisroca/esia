-- DropForeignKey
ALTER TABLE "UserArtwork" DROP CONSTRAINT "UserArtwork_artworkId_fkey";

-- DropForeignKey
ALTER TABLE "UserArtwork" DROP CONSTRAINT "UserArtwork_userId_fkey";

-- AddForeignKey
ALTER TABLE "UserArtwork" ADD CONSTRAINT "UserArtwork_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserArtwork" ADD CONSTRAINT "UserArtwork_artworkId_fkey" FOREIGN KEY ("artworkId") REFERENCES "Artwork"("id") ON DELETE CASCADE ON UPDATE CASCADE;
