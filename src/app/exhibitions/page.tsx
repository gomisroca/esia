import { api } from '@/trpc/server';
import LoadingBar from '../_components/ui/LoadingBar';
import { Suspense } from 'react';
import ExhibitionInfiniteList from './ExhibitionInfiniteList';
import ErrorPage from '../_components/ErrorPage';

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
