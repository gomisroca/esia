/**
 * Renders a list of artworks.
 *
 * @param {string} artworks - The artworks to display.
 * @param {boolean} [artistView] - Whether to display the artworks as artist view.
 *
 * @example
 * <ArtworkList artworks={artworks} />
 */

import { type ArtworkWithArtist } from 'types';
import ArtworkCard from './ArtworkCard';

export default function ArtworkList({
  artworks,
  artistView,
}: Readonly<{ artworks: ArtworkWithArtist[]; artistView?: boolean }>) {
  return (
    <div className="mx-auto flex w-full flex-wrap items-center justify-center gap-2" role="list">
      {artworks.map((artwork) => (
        <ArtworkCard key={artwork.id} artwork={artwork} artistView={artistView} />
      ))}
    </div>
  );
}
