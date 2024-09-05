-- CreateTable
CREATE TABLE "UserArtwork" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "artworkId" TEXT NOT NULL,

    CONSTRAINT "UserArtwork_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "UserArtwork" ADD CONSTRAINT "UserArtwork_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserArtwork" ADD CONSTRAINT "UserArtwork_artworkId_fkey" FOREIGN KEY ("artworkId") REFERENCES "Artwork"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
