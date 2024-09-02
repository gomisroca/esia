/**
 * Renders the artist information.
 *
 * @param {Artist} artist - The artist object to be displayed.
 *
 * @example
 * <ArtistInfo artist={artist} />
 */

import { type Artist } from '@prisma/client';

export default function ArtistInfo({ artist }: Readonly<{ artist: Artist }>) {
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
