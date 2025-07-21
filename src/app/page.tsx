'use client';

/**
 * Renders a list of artworks.
 *
 * @example
 * <LandingPage />
 */

import { api } from '@/trpc/react';

import ArtworkCard from './_components/ui/ArtworkCard';
import { VirtualGrid } from './_components/ui/VirtualGrid';

export default function LandingPage() {
  const { data: artworks, isLoading } = api.artworks.getAll.useQuery({ artist: true });

  if (isLoading || !artworks) return <p>Loading...</p>;

  return (
    <VirtualGrid
      items={artworks}
      columnCount={3}
      estimateHeight={725}
      renderItem={(artwork) => <ArtworkCard artwork={artwork} artistView={false} />}
    />
  );
}
