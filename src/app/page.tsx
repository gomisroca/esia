/**
 * Renders a list of artworks with infinite scrolling.
 *
 * @example
 * <LandingPage />
 */

import { api } from '@/trpc/server';

import ArtworkCard from './_components/ui/ArtworkCard';

export default async function LandingPage() {
  const artworks = await api.artworks.getAll({
    artist: true,
  });

  return (
    <div className="mx-auto flex w-full flex-wrap items-center justify-center gap-2" role="list">
      {artworks.map((artwork) => (
        <div key={artwork.id}>
          <ArtworkCard artwork={artwork} artistView={false} />
        </div>
      ))}
    </div>
  );
}
