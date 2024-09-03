/**
 * Renders a list of artworks with infinite scrolling.
 *
 * @example
 * <LandingPage />
 */

import LoadingBar from './_components/ui/LoadingBar';
import { Suspense } from 'react';
import { api } from '@/trpc/server';
import ArtworkList from './_components/ui/ArtworkList';
import ErrorPage from './_components/ErrorPage';

export default async function LandingPage() {
  try {
    const artworks = await api.artworks.getAll();
    return (
      <Suspense fallback={<LoadingBar />}>
        <ArtworkList artworks={artworks} />
      </Suspense>
    );
  } catch (_error: unknown) {
    return <ErrorPage message="Failed to load artworks" />;
  }
}
