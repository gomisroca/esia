/**
 * Renders a list of artworks.
 *
 * @param {string} artworks - The artworks to display.
 *
 * @example
 * <ArtworkList artworks={artworks} />
 */

import { type ArtworkWithArtist } from 'types';
import ArtworkCard from './ArtworkCard';

export default function ArtworkList({ artworks }: Readonly<{ artworks: ArtworkWithArtist[] }>) {
  return (
    <div className="mx-auto flex w-full flex-wrap items-center justify-center gap-2" role="list">
      {artworks.map((artwork) => (
        <ArtworkCard key={artwork.id} artwork={artwork} />
      ))}
    </div>
  );
}
