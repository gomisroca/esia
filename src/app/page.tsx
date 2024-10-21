/**
 * Renders a list of artworks with infinite scrolling.
 *
 * @example
 * <LandingPage />
 */

import LoadingBar from './_components/ui/LoadingBar';
import { Suspense } from 'react';
import ErrorPage from './_components/ErrorPage';
import LandingInfiniteList from './LandingInfiniteList';
import { api } from '@/trpc/server';

export default async function LandingPage() {
  const initialArtworks = await api.artworks.getAll({ limit: 6 });
  try {
    return (
      <Suspense fallback={<LoadingBar />}>
        <LandingInfiniteList initialArtworks={initialArtworks} />
      </Suspense>
    );
  } catch (_error: unknown) {
    return <ErrorPage message="Failed to load artworks" />;
  }
}
