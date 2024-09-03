'use client';
/**
 * Renders an artwork card component.
 *
 * @param {ArtworkWithArtist} artwork - The artwork object to be displayed.
 * @param {boolean} artistView - Whether the artwork is being displayed in the artist view.
 *
 * @example
 * <ArtworkCard artwork={artwork} />
 */

import Image from 'next/image';
import React, { memo, useState } from 'react';
import { type ArtworkWithArtist } from 'types';
import Link from 'next/link';

interface ArtworkCardProps {
  artwork: ArtworkWithArtist;
  artistView?: boolean;
}

function ArtworkSkeleton() {
  return <div data-testid="artwork-skeleton" className="h-full w-full animate-pulse rounded-md bg-neutral-800/50" />;
}

function ArtworkCardContent({ artwork, artistView = false }: ArtworkCardProps) {
  // State variable to track whether the image is loaded
  const [loaded, setLoaded] = useState(false);

  // State variable to track whether the card is flipped
  const [isFlipped, setIsFlipped] = useState(false);
  const handleFlip = () => {
    setIsFlipped(!isFlipped);
  };
  return (
    <div
      className="group relative h-[45rem] w-[30rem] cursor-pointer overflow-hidden rounded-md"
      onClick={handleFlip}
      data-testid="artwork-card">
      {/* Skeleton while image is loading */}
      {!loaded && <ArtworkSkeleton />}

      {/* Image */}
      <Image
        onLoad={() => setLoaded(true)}
        src={artwork.image!}
        alt={artwork.name}
        width={300}
        height={200}
        className={`h-full w-full object-cover transition-transform duration-500 ease-in-out ${isFlipped ? 'scale-110' : 'scale-100'} group-hover:scale-110`}
      />

      {/* Overlay on hover/click */}
      <div
        className={`absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 transition-opacity duration-500 ease-in-out ${isFlipped ? 'opacity-100' : 'opacity-0'} group-hover:opacity-100`}>
        <div className="min-h-2/3 m-4 w-full rounded-md border-2 border-neutral-200/20 bg-neutral-200/60 p-4 text-center text-neutral-800 drop-shadow-md transition-all duration-200 dark:border-neutral-800/20 dark:bg-neutral-800/60 dark:text-neutral-200">
          <h3 className="mb-2 text-2xl font-semibold">{artwork.name}</h3>
          {!artistView && (
            <Link href={`/artist/${artwork.artist.id}`}>
              <p>{artwork.artist.name}</p>
            </Link>
          )}
          <p>{artwork.date}</p>
          <p>{artwork.origin}</p>
          <p>{artwork.medium}</p>
          <p>{artwork.style}</p>
        </div>
      </div>
    </div>
  );
}

const ArtworkCard = memo((props: Readonly<{ artwork: ArtworkWithArtist; artistView?: boolean }>) => {
  return <ArtworkCardContent {...props} />;
});
ArtworkCard.displayName = 'ArtworkCard';

export default ArtworkCard;
