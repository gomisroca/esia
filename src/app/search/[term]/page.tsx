import { Suspense } from 'react';

import ErrorPage from '@/app/_components/ErrorPage';
import ArtworkList from '@/app/_components/ui/ArtworkList';
import LoadingBar from '@/app/_components/ui/LoadingBar';
import { api } from '@/trpc/server';

export default async function Search({ params }: { params: Promise<{ term: string }> }) {
  const { term } = await params;
  const cleanTerm = decodeURIComponent(term).replace(/\+/g, ' ');

  const artworks = await api.artworks.search({ term: cleanTerm }).catch(() => null);

  if (!artworks?.length) return <ErrorPage message="No artworks found" />;

  return (
    <Suspense fallback={<LoadingBar />}>
      <ArtworkList artworks={artworks} />
    </Suspense>
  );
}
