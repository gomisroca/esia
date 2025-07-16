/**
 * Renders an artist page with their information and artworks.
 *
 * @param {string} params.id - The id of the artist to display.
 *
 * @example
 * <Artist id="123" />
 */

import { type Artist, type Artwork } from '@prisma/client';
import Image from 'next/image';
import { Suspense } from 'react';

import ErrorPage from '@/app/_components/ErrorPage';
import ArtworkList from '@/app/_components/ui/ArtworkList';
import LoadingBar from '@/app/_components/ui/LoadingBar';
import Title from '@/app/_components/ui/Title';
import { api } from '@/trpc/server';

/**
 * Renders the artist information.
 *
 * @param {Artist} artist - The artist object to be displayed.
 *
 * @example
 * <ArtistInfo artist={artist} />
 */
function ArtistInfo({ artist, artworks }: Readonly<{ artist: Artist; artworks: Artwork[] }>) {
  return (
    <>
      <div className="flex flex-col items-center justify-center gap-2">
        <Title>{artist.name}</Title>
        {artist.birth && (
          <p className="text-center text-lg font-bold text-neutral-800 dark:text-neutral-200">
            {artist.birth} - {artist.death && artist.death}
          </p>
        )}
      </div>
      {artworks.length > 3 && (
        <Image
          unoptimized
          src={artworks[Math.floor(Math.random() * artworks.length)]!.image!}
          alt={artworks[Math.floor(Math.random() * artworks.length)]!.name}
          width={300}
          height={300}
          className="rounded-md shadow-md"
        />
      )}
      {artist.description && (
        <p className="rounded-md bg-neutral-800/10 p-5 text-neutral-800 dark:bg-neutral-200/10 dark:text-neutral-200">
          {artist.description.replace(/<[^>]+>/g, '\n')}
        </p>
      )}
    </>
  );
}

export default async function Artist({ params }: Readonly<{ params: { id: string } }>) {
  try {
    const artist = await api.artists.getUnique({ id: params.id, artworks: true });
    if (!artist) return <ErrorPage message="Failed to load artist or artworks" />;
    return (
      <Suspense fallback={<LoadingBar />}>
        {artist && (
          <>
            <ArtistInfo artist={artist} artworks={artist.artworks} />
            <ArtworkList artworks={artist.artworks} artistView={true} />
          </>
        )}
      </Suspense>
    );
  } catch (_error: unknown) {
    return <ErrorPage message="Failed to load artist or artworks" />;
  }
}
