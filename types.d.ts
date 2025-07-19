import { type Artist, type Artwork } from 'generated/prisma';

interface ArtworkWithArtist extends Artwork {
  artist?: Artist;
}

interface ArtistWithArtworks extends Artist {
  artworks: ArtworkWithArtist[];
}

interface Provider {
  name: string;
  icon: React.ReactNode;
}
