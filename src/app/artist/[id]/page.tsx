/**
 * Renders an artist page with their information and artworks.
 *
 * @param {string} params.id - The id of the artist to display.
 *
 * @example
 * <Artist id="123" />
 */

import { api, HydrateClient } from '@/trpc/server';
import { Suspense } from 'react';
import { type Artist } from '@prisma/client';
import LoadingBar from '@/app/_components/ui/LoadingBar';
import ArtistInfo from './ArtistInfo';
import ArtworkList from '@/app/_components/ui/ArtworkList';

export default async function Artist({ params }: Readonly<{ params: { id: string } }>) {
  const artist = await api.artists.getInformation({ artistId: params.id });
  const artworks = await api.artworks.getByArtist({ artistId: params.id });

  return (
    <HydrateClient>
      <Suspense fallback={<LoadingBar />}>
        {artist && (
          <>
            <ArtistInfo artist={artist} />
            <ArtworkList artworks={artworks} artistView={true} />
          </>
        )}
      </Suspense>
    </HydrateClient>
  );
}
