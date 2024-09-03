/**
 * Renders a list of artworks with infinite scrolling based on a search term.
 *
 * @param {string} term - The search term to search for.
 *
 * @example
 * <Search term="The Bath" />
 */

import ErrorPage from '@/app/_components/ErrorPage';
import ArtworkList from '@/app/_components/ui/ArtworkList';
import LoadingBar from '@/app/_components/ui/LoadingBar';
import { api } from '@/trpc/server';
import { Suspense } from 'react';

export default async function Search({ params }: Readonly<{ params: { term: string } }>) {
  try {
    const encodedTerm = params.term;
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
