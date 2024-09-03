/**
 * Renders an artist page with their information and artworks.
 *
 * @param {string} params.id - The id of the artist to display.
 *
 * @example
 * <Artist id="123" />
 */

import { api } from '@/trpc/server';
import { Suspense } from 'react';
import { type Artist } from '@prisma/client';
import LoadingBar from '@/app/_components/ui/LoadingBar';
import ArtworkList from '@/app/_components/ui/ArtworkList';
import ErrorPage from '@/app/_components/ErrorPage';

/**
 * Renders the artist information.
 *
 * @param {Artist} artist - The artist object to be displayed.
 *
 * @example
 * <ArtistInfo artist={artist} />
 */
function ArtistInfo({ artist }: Readonly<{ artist: Artist }>) {
  return (
    <>
      <div className="flex flex-col items-center justify-center gap-2">
        <h1 className="text-center text-3xl font-bold text-neutral-800 dark:text-neutral-200">{artist.name}</h1>
        {artist.birth && (
          <p className="text-center text-lg font-bold text-neutral-800 dark:text-neutral-200">
            {artist.birth} - {artist.death && artist.death}
          </p>
        )}
      </div>
      {artist.description && (
        <p className="rounded-md bg-neutral-800/10 p-5 text-neutral-800 dark:bg-neutral-200/10 dark:text-neutral-200 md:m-5">
          {artist.description.replace(/<[^>]+>/g, '\n')}
        </p>
      )}
    </>
  );
}

export default async function Artist({ params }: Readonly<{ params: { id: string } }>) {
  try {
    const artist = await api.artists.getInformation({ artistId: params.id });
    const artworks = await api.artworks.getByArtist({ artistId: params.id });
    if (!artist) return <ErrorPage message="Failed to load artist or artworks" />;
    return (
      <Suspense fallback={<LoadingBar />}>
        {artist && (
          <>
            <ArtistInfo artist={artist} />
            <ArtworkList artworks={artworks} artistView={true} />
          </>
        )}
      </Suspense>
    );
  } catch (_error: unknown) {
    return <ErrorPage message="Failed to load artist or artworks" />;
  }
}
