/**
 * Renders an artwork card component.
 *
 * @param {ArtworkWithArtist} artwork - The artwork object to be displayed.
 *
 * @example
 * <ArtworkCard artwork={artwork} />
 */

import Image from 'next/image';
import React, { useState } from 'react';
import ArtworkSkeleton from './skeleton';
import { type ArtworkWithArtist } from 'types';

interface ArtworkCardProps {
  artwork: ArtworkWithArtist;
}

export function ArtworkCard({ artwork }: ArtworkCardProps) {
  // State variable to track whether the image is loaded
  const [loaded, setLoaded] = useState(false);

  return (
    <div
      className="group relative h-[45rem] w-[30rem] cursor-pointer overflow-hidden rounded-md"
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
        className="h-full w-full object-cover transition-transform duration-500 ease-in-out group-hover:scale-110"
      />

      {/* Overlay on hover/click */}
      <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-60 opacity-0 transition-opacity duration-500 ease-in-out group-hover:opacity-100">
        <div className="p-4 text-center text-white">
          <h3 className="mb-2 text-2xl font-semibold">{artwork.name}</h3>
          <h4 className="mb-2 text-lg font-semibold">{artwork.artist.name}</h4>
          <p>{artwork.date}</p>
          <p>{artwork.origin}</p>
          <p>{artwork.medium}</p>
          <p>{artwork.style}</p>
        </div>
      </div>
    </div>
  );
}
