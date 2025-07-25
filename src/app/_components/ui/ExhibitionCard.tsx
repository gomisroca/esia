'use client';

import Image from 'next/image';
import React, { memo, useState } from 'react';
import Title from './Title';
import { type Exhibition } from 'generated/prisma';
import Link from 'next/link';

function ExhibitionSkeleton() {
  return <div data-testid="exhibition-skeleton" className="h-full w-full animate-pulse rounded-md bg-neutral-800/50" />;
}

function ExhibitionCardContent({ exhibition }: { exhibition: Exhibition }) {
  // State variable to track whether the image is loaded
  const [loaded, setLoaded] = useState(false);

  return (
    <div
      className="group relative h-[30rem] w-[22rem] cursor-pointer overflow-hidden rounded-md md:h-[45rem] md:w-[30rem]"
      data-testid="exhibition-card">
      {/* Skeleton while image is loading */}
      {!loaded && <ExhibitionSkeleton />}

      {/* Image */}
      <Image
        unoptimized
        onLoad={() => setLoaded(true)}
        src={exhibition.image ?? '/ph.jpg'}
        alt={exhibition.name}
        width={300}
        height={200}
        className="h-full w-full object-cover transition-transform duration-500 ease-in-out"
      />

      <Link
        href={`/exhibitions/${exhibition.id}`}
        className="absolute inset-0 flex items-center justify-center bg-black/50 transition duration-500 ease-in-out group-hover:scale-105">
        <div className="min-h-2/3 m-4 w-full rounded-md border-2 border-neutral-200/20 bg-neutral-200/60 p-4 text-center text-neutral-800 drop-shadow-md transition-all duration-500 group-hover:bg-neutral-200/80 dark:border-neutral-800/20 dark:bg-neutral-800/60 dark:text-neutral-200 group-hover:dark:bg-neutral-800/80">
          <Title className="mb-2">{exhibition.name}</Title>
          <p>
            {exhibition.start.toDateString()} - {exhibition.end.toDateString()}
          </p>
          <p dangerouslySetInnerHTML={{ __html: exhibition.description }} className="line-clamp-5" />
        </div>
      </Link>
    </div>
  );
}

const ExhibitionCard = memo((props: Readonly<{ exhibition: Exhibition }>) => {
  return <ExhibitionCardContent {...props} />;
});
ExhibitionCard.displayName = 'ExhibitionCard';

export default ExhibitionCard;
