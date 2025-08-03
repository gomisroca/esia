'use client';

/**
 * Renders an artwork card component.
 *
 * @param {ReactNode} children - The content to be displayed in the card.
 * @param {string} image - The URL of the image.
 * @param {string} name - The name of the card's content.
 *
 * @example
 * <Card image="/path/to/image.jpg" name="Card Name">
 *   <p>Card Content</p>
 * </Card>
 */

import Image from 'next/image';
import React, { memo, ReactNode, useState } from 'react';

function CardSkeleton() {
  return <div data-testid="card-skeleton" className="h-full w-full animate-pulse bg-black/80" />;
}

function CardContent({ children, image, name }: { children: ReactNode; image?: string; name: string }) {
  // State variable to track whether the image is loaded
  const [loaded, setLoaded] = useState(false);

  // State variable to track whether the card is flipped
  const [isFlipped, setIsFlipped] = useState(false);
  const handleFlip = () => {
    setIsFlipped(!isFlipped);
  };

  return (
    <div
      className="group relative h-[30rem] w-[22rem] cursor-pointer overflow-hidden rounded-sm md:h-[45rem] md:w-[30rem]"
      onClick={handleFlip}
      data-flipped={isFlipped}
      data-testid="card">
      {!loaded && <CardSkeleton />}

      <Image
        unoptimized
        onLoad={() => setLoaded(true)}
        src={image ?? '/ph.jpg'}
        alt={name}
        width={300}
        height={200}
        className={`h-full w-full rounded-sm object-cover transition-transform duration-200 ease-in ${isFlipped ? 'scale-110' : 'scale-100'} group-hover:scale-110`}
      />

      {/* Overlay on hover/click */}
      <div
        className={`absolute inset-0 flex items-center justify-center rounded-sm bg-black/60 transition-opacity duration-200 ease-in ${isFlipped ? 'opacity-100' : 'opacity-0'} group-hover:opacity-100`}>
        <div className="m-4 flex min-h-2/3 w-full cursor-default flex-col items-center justify-evenly rounded-sm bg-white/60 p-4 text-center drop-shadow-md transition-all duration-200 dark:bg-black/60">
          {children}
        </div>
      </div>
    </div>
  );
}

const Card = memo((props: Readonly<{ children: ReactNode; image?: string; name: string }>) => {
  return <CardContent {...props} />;
});
Card.displayName = 'Card';

export default Card;
