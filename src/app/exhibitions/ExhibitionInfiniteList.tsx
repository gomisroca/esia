'use client';

import { useIntersection } from '@mantine/hooks';
import { useEffect } from 'react';

import { api, type RouterOutputs } from '@/trpc/react';

import ExhibitionCard from '../_components/ui/ExhibitionCard';

type ExhibitionListOutput = RouterOutputs['exhibitions']['getAll'];
interface ExhibitionInfiniteListProps {
  initialExhibitions: ExhibitionListOutput;
}
export default function ExhibitionInfiniteList({ initialExhibitions }: ExhibitionInfiniteListProps) {
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, status } = api.exhibitions.getAll.useInfiniteQuery(
    {
      limit: 6,
    },
    {
      getNextPageParam: (lastPage) => lastPage.nextCursor,
      initialData: { pages: [initialExhibitions], pageParams: [undefined] },
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
              {page.exhibitions.map((exhibition, index) => (
                <div key={exhibition.id} ref={index === page.exhibitions.length - 1 ? ref : undefined}>
                  <ExhibitionCard exhibition={exhibition} />
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
