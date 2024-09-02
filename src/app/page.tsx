/**
 * Renders a list of artworks with infinite scrolling.
 *
 * @example
 * <LandingPage />
 */

import LoadingBar from './_components/ui/LoadingBar';
import { Suspense } from 'react';
import { api, HydrateClient } from '@/trpc/server';
import ArtworkList from './_components/ui/ArtworkList';

export default async function LandingPage() {
  const artworks = await api.artworks.getAll();
  return (
    <HydrateClient>
      <Suspense fallback={<LoadingBar />}>
        <ArtworkList artworks={artworks} />
      </Suspense>
    </HydrateClient>
  );
}
