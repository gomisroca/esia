/**
 * Renders a list of artworks with infinite scrolling based on a style.
 *
 * @param {string} style - The style of artworks to display.
 *
 * @example
 * <StyleBasedList style="Impressionism" />
 */

import ArtworkList from '@/app/_components/ui/ArtworkList';
import LoadingBar from '@/app/_components/ui/LoadingBar';
import { api, HydrateClient } from '@/trpc/server';
import { Suspense } from 'react';

export default async function StyleBasedList({ params }: Readonly<{ params: { name: string } }>) {
  const encodedStyleName = params.name;
  const decodedStyleName = decodeURIComponent(encodedStyleName);
  const styleName = decodedStyleName.replace(/\+/g, ' ');

  const artworks = await api.artworks.getByStyle({ style: styleName });

  return (
    <HydrateClient>
      <Suspense fallback={<LoadingBar />}>
        <ArtworkList artworks={artworks} />
      </Suspense>
    </HydrateClient>
  );
}
