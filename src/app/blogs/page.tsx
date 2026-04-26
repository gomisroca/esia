'use client';

import { api } from '@/trpc/react';

import BlogCard from '../_components/ui/BlogCard';
import LoadingBar from '../_components/ui/LoadingBar';
import { VirtualGrid } from '../_components/ui/VirtualGrid';
import { useColumnCount } from '../hooks/useColumnCount';

export default function BlogList() {
  const { data, isPending } = api.blogs.getAll.useQuery();
  const columnCount = useColumnCount();

  if (isPending || !data) return <LoadingBar />;

  return (
    <VirtualGrid
      items={data}
      columnCount={columnCount}
      estimateHeight={500}
      renderItem={(blog) => <BlogCard blog={blog} />}
    />
  );
}
