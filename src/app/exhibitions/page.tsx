'use client';

import { api } from '@/trpc/react';

import ExhibitionCard from '../_components/ui/ExhibitionCard';
import LoadingBar from '../_components/ui/LoadingBar';
import { VirtualGrid } from '../_components/ui/VirtualGrid';

export default function ExhibitionList() {
  const { data: exhibitions, isLoading } = api.exhibitions.getAll.useQuery();

  if (isLoading || !exhibitions) return <LoadingBar />;

  return (
    <VirtualGrid
      items={exhibitions}
      columnCount={3}
      estimateHeight={725}
      renderItem={(exhibition) => <ExhibitionCard exhibition={exhibition} />}
    />
  );
}
