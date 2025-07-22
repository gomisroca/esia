'use client';

import { api } from '@/trpc/react';

import BlogCard from '../_components/ui/BlogCard';
import LoadingBar from '../_components/ui/LoadingBar';
import { VirtualGrid } from '../_components/ui/VirtualGrid';

export default function BlogList() {
  const { data: blogs, isLoading } = api.blogs.getAll.useQuery();

  if (isLoading || !blogs) return <LoadingBar />;

  return (
    <VirtualGrid items={blogs} columnCount={3} estimateHeight={725} renderItem={(blog) => <BlogCard blog={blog} />} />
  );
}
