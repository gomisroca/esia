'use client';

import { api, type RouterOutputs } from '@/trpc/react';
import { useIntersection } from '@mantine/hooks';
import ArtworkCard from './_components/ui/ArtworkCard';
import { useEffect } from 'react';

type ArtworkListOutput = RouterOutputs['artworks']['getAll'];
interface LandingInfiniteListProps {
  initialArtworks: ArtworkListOutput;
}
function LandingInfiniteList({ initialArtworks }: LandingInfiniteListProps) {
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, status } = api.artworks.getAll.useInfiniteQuery(
    {
      artist: true,
      limit: 6,
    },
    {
      getNextPageParam: (lastPage) => lastPage.nextCursor,
      initialData: { pages: [initialArtworks], pageParams: [undefined] },
    }
  );

  const { ref, entry } = useIntersection({
    root: null,
    threshold: 1,
  });

  useEffect(() => {
    if (entry?.isIntersecting && hasNextPage && !isFetchingNextPage) {
      void fetchNextPage();
    }
  }, [entry, fetchNextPage, hasNextPage, isFetchingNextPage]);

  return (
    <div className="flex flex-col space-y-4">
      {status === 'pending' ? (
        <h1 className="p-4 text-xl font-bold">Loading...</h1>
      ) : status === 'error' ? (
        <h1 className="p-4 text-xl font-bold">Error fetching posts</h1>
      ) : (
        <>
          {data?.pages.map((page, i) => (
            <div className="mx-auto flex w-full flex-wrap items-center justify-center gap-2" role="list" key={i}>
              {page.artworks.map((artwork, index) => (
                <div key={artwork.id} ref={index === page.artworks.length - 1 ? ref : undefined}>
                  <ArtworkCard artwork={artwork} artistView={false} />
                </div>
              ))}
            </div>
          ))}
          {isFetchingNextPage && <h1 className="m-auto p-4 text-xl font-bold">Loading more...</h1>}
        </>
      )}
    </div>
  );
}

export default LandingInfiniteList;
