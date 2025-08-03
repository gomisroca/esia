'use client';
/**
 * Renders an artwork card component.
 *
 * @param {ArtworkWithArtist} artwork - The artwork object to be displayed.
 *
 * @example
 * <ArtworkCard artwork={artwork} />
 */

import React, { memo } from 'react';
import { type ArtworkWithArtist } from 'types';

import Card from './Card';
import Title from './Title';
import Link from './Link';

function ArtworkCardContent({ artwork }: { artwork: ArtworkWithArtist }) {
  return (
    <Card image={artwork.image ?? undefined} name={artwork.name}>
      <section className="flex flex-col gap-4">
        <Title className="mb-2">{artwork.name}</Title>
        <div className="flex items-center justify-center gap-2">
          <p>{artwork.date}</p>
          <p>{artwork.origin}</p>
        </div>
        {artwork.artist && <Link href={`/artist/${artwork.artist.id}`}>{artwork.artist.name}</Link>}
      </section>
      <section className="flex flex-col gap-2">
        <p>{artwork.medium}</p>
        <p>{artwork.style}</p>
      </section>
    </Card>
  );
}

const ArtworkCard = memo((props: Readonly<{ artwork: ArtworkWithArtist }>) => {
  return <ArtworkCardContent {...props} />;
});
ArtworkCard.displayName = 'ArtworkCard';

export default ArtworkCard;
