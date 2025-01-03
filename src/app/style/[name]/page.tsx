/**
 * Renders a list of artworks with infinite scrolling based on a style.
 *
 * @param {string} style - The style of artworks to display.
 *
 * @example
 * <StyleBasedList style="Impressionism" />
 */

import ErrorPage from '@/app/_components/ErrorPage';
import ArtworkList from '@/app/_components/ui/ArtworkList';
import LoadingBar from '@/app/_components/ui/LoadingBar';
import Title from '@/app/_components/ui/Title';
import { api } from '@/trpc/server';
import { Suspense } from 'react';

export default async function StyleBasedList({ params }: Readonly<{ params: { name: string } }>) {
  try {
    const encodedStyleName = params.name;
    const decodedStyleName = decodeURIComponent(encodedStyleName);
    const styleName = decodedStyleName.replace(/\+/g, ' ');

    const artworks = await api.styles.getUnique({ name: styleName });

    return (
      <Suspense fallback={<LoadingBar />}>
        <Title>{styleName.toUpperCase()}</Title>
        <ArtworkList artworks={artworks} />
      </Suspense>
    );
  } catch (_error: unknown) {
    return <ErrorPage message="Failed to load artworks" />;
  }
}
