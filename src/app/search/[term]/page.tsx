/**
 * Renders a list of artworks with infinite scrolling based on a search term.
 *
 * @param {string} term - The search term to search for.
 *
 * @example
 * <Search term="The Bath" />
 */

import { Suspense } from 'react';

import ErrorPage from '@/app/_components/ErrorPage';
import ArtworkList from '@/app/_components/ui/ArtworkList';
import LoadingBar from '@/app/_components/ui/LoadingBar';
import { api } from '@/trpc/server';

export default async function Search({ params }: { params: Promise<{ term: string }> }) {
  const paramsData = await params;
  try {
    const encodedTerm = paramsData.term;
    const decodedTerm = decodeURIComponent(encodedTerm);
    const cleanTerm = decodedTerm.replace(/\+/g, ' ');

    const artworks = await api.artworks.search({ term: cleanTerm });

    if (!artworks || artworks.length === 0) return <ErrorPage message="No artworks found" />;
    return (
      <Suspense fallback={<LoadingBar />}>
        <ArtworkList artworks={artworks} />
      </Suspense>
    );
  } catch (_error: unknown) {
    return <ErrorPage message="Something went wrong" />;
  }
}
