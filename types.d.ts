import { type Artist, type Artwork } from '@prisma/client';

interface ArtworkWithArtist extends Artwork {
  artist: Artist;
}

interface Provider {
  name: string;
  icon: React.ReactNode;
}
