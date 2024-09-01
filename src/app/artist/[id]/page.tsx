/**
 * Renders an artist page with their information and artworks.
 *
 * @param {string} params.id - The id of the artist to display.
 *
 * @example
 * <Artist id="123" />
 */

import { api, HydrateClient } from '@/trpc/server';
import { ArtworkCard } from '@/app/_components/ui/ArtworkCard';

export default async function Artist({ params }: Readonly<{ params: { id: string } }>) {
  const artist = await api.artists.getInformation({ artistId: params.id });
  const artworks = await api.artworks.getByArtist({ artistId: params.id });

  return (
    <HydrateClient>
      {artist ? (
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
          <div className="mx-auto flex min-h-[60rem] w-full flex-wrap items-center justify-center gap-2" role="list">
            {artworks.map((artwork) => (
              <ArtworkCard key={artwork.id} artwork={artwork} artistView={true} />
            ))}
          </div>
        </>
      ) : (
        // If the artist is not found, display an error message
        <div className="flex min-h-[60rem] w-full flex-col items-center justify-center gap-2">
          <h1 className="text-center text-3xl font-bold text-neutral-800 dark:text-neutral-200">Artist not found</h1>
          <p className="text-center text-lg font-bold text-neutral-800 dark:text-neutral-200">
            Please check the artist ID and try again.
          </p>
        </div>
      )}
    </HydrateClient>
  );
}
