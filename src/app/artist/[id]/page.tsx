import { type Artwork } from 'generated/prisma';
import Image from 'next/image';
import { Suspense } from 'react';

import ErrorPage from '@/app/_components/ErrorPage';
import ArtworkList from '@/app/_components/ui/ArtworkList';
import LoadingBar from '@/app/_components/ui/LoadingBar';
import Title from '@/app/_components/ui/Title';
import { api } from '@/trpc/server';

type ArtistWithArtworks = Awaited<ReturnType<typeof api.artists.getUnique>>;

function ArtistInfo({ artist }: Readonly<{ artist: NonNullable<ArtistWithArtworks> & { artworks: Artwork[] } }>) {
  const randomArtwork = artist.artworks[Math.floor(Math.random() * artist.artworks.length)];

  return (
    <>
      <div className="flex flex-col items-center justify-center gap-2">
        <Title>{artist.name}</Title>
        {artist.birth && (
          <p className="text-center text-lg font-bold">
            {artist.birth}
            {artist.death ? ` - ${artist.death}` : ''}
          </p>
        )}
      </div>
      {artist.artworks.length > 3 && randomArtwork?.image && (
        <Image
          unoptimized
          src={randomArtwork.image}
          alt={randomArtwork.name}
          width={300}
          height={300}
          className="rounded-sm shadow-md"
        />
      )}
      {artist.description && (
        <p className="rounded-sm bg-neutral-800/10 p-5 dark:bg-neutral-200/10">
          {artist.description.replace(/<[^>]+>/g, '\n')}
        </p>
      )}
    </>
  );
}

export default async function Artist({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const artist = await api.artists.getUnique({ id, artworks: true }).catch(() => null);

  if (!artist) return <ErrorPage message="Failed to load artist or artworks" />;

  return (
    <Suspense fallback={<LoadingBar />}>
      <ArtistInfo artist={artist} />
      <ArtworkList artworks={artist.artworks} />
    </Suspense>
  );
}
