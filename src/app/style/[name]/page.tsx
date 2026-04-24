import { Suspense } from 'react';

import ErrorPage from '@/app/_components/ErrorPage';
import ArtworkList from '@/app/_components/ui/ArtworkList';
import LoadingBar from '@/app/_components/ui/LoadingBar';
import Title from '@/app/_components/ui/Title';
import { api } from '@/trpc/server';

export default async function StyleBasedList({ params }: { params: Promise<{ name: string }> }) {
  const { name } = await params;
  const styleName = decodeURIComponent(name).replace(/\+/g, ' ');

  const artworks = await api.styles.getUnique({ name: styleName }).catch(() => null);

  if (!artworks) return <ErrorPage message="Failed to load artworks" />;

  return (
    <Suspense fallback={<LoadingBar />}>
      <Title>{styleName.toUpperCase()}</Title>
      <ArtworkList artworks={artworks} />
    </Suspense>
  );
}
