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
import Link from 'next/link';
import Button from './Button';

function ArtworkCardContent({ artwork }: { artwork: ArtworkWithArtist }) {
  return (
    <Card image={artwork.image ?? undefined} name={artwork.name}>
      <Title className="mb-2">{artwork.name}</Title>
      {artwork.artist && (
        <Link href={`/artist/${artwork.artist.id}`} className="m-auto flex w-fit cursor-pointer">
          <Button className="border-b border-neutral-800/20 bg-transparent shadow-md backdrop-blur-none dark:border-neutral-200/20 dark:bg-transparent">
            {artwork.artist.name}
          </Button>
        </Link>
      )}
      <p>{artwork.date}</p>
      <p>{artwork.origin}</p>
      <p>{artwork.medium}</p>
      <p>{artwork.style}</p>
    </Card>
  );
}

const ArtworkCard = memo((props: Readonly<{ artwork: ArtworkWithArtist }>) => {
  return <ArtworkCardContent {...props} />;
});
ArtworkCard.displayName = 'ArtworkCard';

export default ArtworkCard;
