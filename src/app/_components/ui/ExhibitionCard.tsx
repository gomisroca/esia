'use client';

import React, { memo } from 'react';
import Title from './Title';
import { type Exhibition } from 'generated/prisma';
import Link from 'next/link';
import Card from './Card';

function ExhibitionCardContent({ exhibition }: { exhibition: Exhibition }) {
  return (
    <Card image={exhibition.image ?? undefined} name={exhibition.name}>
      <Link
        href={`/exhibitions/${exhibition.id}`}
        className="absolute inset-0 flex items-center justify-center bg-black/50 transition duration-500 ease-in-out group-hover:scale-105">
        <div className="m-4 min-h-2/3 w-full rounded-md border-2 border-neutral-200/20 bg-neutral-200/60 p-4 text-center text-neutral-800 drop-shadow-md transition-all duration-500 group-hover:bg-neutral-200/80 dark:border-neutral-800/20 dark:bg-neutral-800/60 dark:text-neutral-200 group-hover:dark:bg-neutral-800/80">
          <Title className="mb-2">{exhibition.name}</Title>
          <p>
            {exhibition.start.toDateString()} - {exhibition.end.toDateString()}
          </p>
          <p dangerouslySetInnerHTML={{ __html: exhibition.description }} className="line-clamp-5" />
        </div>
      </Link>
    </Card>
  );
}

const ExhibitionCard = memo((props: Readonly<{ exhibition: Exhibition }>) => {
  return <ExhibitionCardContent {...props} />;
});
ExhibitionCard.displayName = 'ExhibitionCard';

export default ExhibitionCard;
