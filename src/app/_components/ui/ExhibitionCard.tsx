'use client';

import React, { memo } from 'react';
import Title from './Title';
import { type Exhibition } from 'generated/prisma';
import Link from 'next/link';
import Card from './Card';

function ExhibitionCardContent({ exhibition }: { exhibition: Exhibition }) {
  return (
    <Card image={exhibition.image ?? undefined} name={exhibition.name}>
      <section className="flex flex-col gap-4">
        <Link
          href={`/exhibitions/${exhibition.id}`}
          className="flex cursor-pointer transition-transform duration-200 ease-in-out hover:scale-110">
          <Title>{exhibition.name}</Title>
        </Link>
        <p>
          {exhibition.start.toDateString()} - {exhibition.end.toDateString()}
        </p>
      </section>
      <div className="rounded-md bg-slate-900/10 p-2 text-left md:p-4">
        <p dangerouslySetInnerHTML={{ __html: exhibition.description }} className="line-clamp-5" />
      </div>
    </Card>
  );
}

const ExhibitionCard = memo((props: Readonly<{ exhibition: Exhibition }>) => {
  return <ExhibitionCardContent {...props} />;
});
ExhibitionCard.displayName = 'ExhibitionCard';

export default ExhibitionCard;
