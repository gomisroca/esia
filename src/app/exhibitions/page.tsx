'use client';

import { api } from '@/trpc/react';

import ExhibitionCard from '../_components/ui/ExhibitionCard';
import LoadingBar from '../_components/ui/LoadingBar';
import { VirtualGrid } from '../_components/ui/VirtualGrid';
import { useColumnCount } from '../hooks/useColumnCount';

export default function ExhibitionList() {
  const { data: exhibitions, isLoading } = api.exhibitions.getAll.useQuery();
  const columnCount = useColumnCount();

  if (isLoading || !exhibitions) return <LoadingBar />;

  return (
    <VirtualGrid
      items={exhibitions}
      columnCount={columnCount}
      estimateHeight={500}
      renderItem={(exhibition) => <ExhibitionCard exhibition={exhibition} />}
    />
  );
}
