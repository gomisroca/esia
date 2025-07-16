import { Suspense } from 'react';

import { api } from '@/trpc/server';

import ErrorPage from '../_components/ErrorPage';
import LoadingBar from '../_components/ui/LoadingBar';
import ExhibitionInfiniteList from './ExhibitionInfiniteList';

export default async function ExhibitionList() {
  const initialExhibitions = await api.exhibitions.getAll({ limit: 6 });
  try {
    return (
      <Suspense fallback={<LoadingBar />}>
        <ExhibitionInfiniteList initialExhibitions={initialExhibitions} />
      </Suspense>
    );
  } catch (_error: unknown) {
    return <ErrorPage message="Failed to load exhibitions" />;
  }
}
