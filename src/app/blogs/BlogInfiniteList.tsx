'use client';

import { useIntersection } from '@mantine/hooks';
import { useEffect } from 'react';

import { api, type RouterOutputs } from '@/trpc/react';

import BlogCard from '../_components/ui/BlogCard';

type BlogListOutput = RouterOutputs['blogs']['getAll'];
interface BlogInfiniteListProps {
  initialBlogs: BlogListOutput;
}
export default function BlogInfiniteList({ initialBlogs }: BlogInfiniteListProps) {
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, status } = api.blogs.getAll.useInfiniteQuery(
    {
      limit: 6,
    },
    {
      getNextPageParam: (lastPage) => lastPage.nextCursor,
      initialData: { pages: [initialBlogs], pageParams: [undefined] },
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
        <h1 className="p-4 text-xl font-bold">Error fetching blogs</h1>
      ) : (
        <>
          {data?.pages.map((page, i) => (
            <div className="mx-auto flex w-full flex-wrap items-center justify-center gap-2" role="list" key={i}>
              {page.blogs.map((blog, index) => (
                <div key={blog.id} ref={index === page.blogs.length - 1 ? ref : undefined}>
                  <BlogCard blog={blog} />
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
