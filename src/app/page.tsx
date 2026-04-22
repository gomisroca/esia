'use client';

import { useEffect } from 'react';
import { useInView } from 'react-intersection-observer';

import { api } from '@/trpc/react';

import ArtworkCard from './_components/ui/ArtworkCard';
import LoadingBar from './_components/ui/LoadingBar';
import { VirtualGrid } from './_components/ui/VirtualGrid';
import { useColumnCount } from './hooks/useColumnCount';

export default function LandingPage() {
  const { data, isPending, fetchNextPage, hasNextPage, isFetchingNextPage } = api.artworks.getAll.useInfiniteQuery(
    { artist: true, limit: 20 },
    {
      getNextPageParam: (lastPage) => lastPage.nextCursor,
      initialCursor: undefined,
    }
  );

  const columnCount = useColumnCount();
  const artworks = data?.pages.flatMap((page) => page.items) ?? [];

  const { ref: setRefs, inView } = useInView({ threshold: 0 });

  useEffect(() => {
    if (inView && hasNextPage && !isFetchingNextPage) {
      void fetchNextPage();
    }
  }, [inView, hasNextPage, isFetchingNextPage, fetchNextPage]);

  if (isPending) return <LoadingBar />;

  return (
    <>
      <VirtualGrid
        items={artworks}
        columnCount={columnCount}
        estimateHeight={500}
        renderItem={(artwork) => <ArtworkCard artwork={artwork} />}
      />
      <div ref={setRefs} />
      {isFetchingNextPage && <LoadingBar />}
    </>
  );
}
