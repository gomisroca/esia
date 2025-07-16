import { Suspense } from 'react';

import { api } from '@/trpc/server';

import ErrorPage from '../_components/ErrorPage';
import LoadingBar from '../_components/ui/LoadingBar';
import BlogInfiniteList from './BlogInfiniteList';

export default async function BlogList() {
  const initialBlogs = await api.blogs.getAll({ limit: 6 });
  try {
    return (
      <Suspense fallback={<LoadingBar />}>
        <BlogInfiniteList initialBlogs={initialBlogs} />
      </Suspense>
    );
  } catch (_error: unknown) {
    return <ErrorPage message="Failed to load blogs" />;
  }
}
