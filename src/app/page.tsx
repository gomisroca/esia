'use client';

/**
 * Renders a list of artworks.
 *
 * @example
 * <LandingPage />
 */

import { api } from '@/trpc/react';

import ArtworkCard from './_components/ui/ArtworkCard';
import LoadingBar from './_components/ui/LoadingBar';
import { VirtualGrid } from './_components/ui/VirtualGrid';
import { useColumnCount } from './hooks/useColumnCount';

export default function LandingPage() {
  const { data: artworks, isLoading } = api.artworks.getAll.useQuery({ artist: true });
  const columnCount = useColumnCount();

  if (isLoading || !artworks) return <LoadingBar />;

  return (
    <VirtualGrid
      items={artworks}
      columnCount={columnCount}
      estimateHeight={500}
      renderItem={(artwork) => <ArtworkCard artwork={artwork} />}
    />
  );
}
