'use client';

import React, { memo } from 'react';
import Title from './Title';
import { type Exhibition } from 'generated/prisma';
import Link from './Link';
import Card from './Card';

function ExhibitionCardContent({ exhibition }: { exhibition: Exhibition }) {
  return (
    <Card image={exhibition.image ?? undefined} name={exhibition.name}>
      <section className="flex flex-col gap-4">
        <Title>{exhibition.name}</Title>
        <p>
          {exhibition.start.toDateString()} - {exhibition.end.toDateString()}
        </p>
      </section>
      <div className="rounded-sm bg-slate-900/10 p-2 text-left md:p-4">
        <p dangerouslySetInnerHTML={{ __html: exhibition.description }} className="line-clamp-5" />
      </div>
      <Link href={`/exhibitions/${exhibition.id}`}>Read More</Link>
    </Card>
  );
}

const ExhibitionCard = memo((props: Readonly<{ exhibition: Exhibition }>) => {
  return <ExhibitionCardContent {...props} />;
});
ExhibitionCard.displayName = 'ExhibitionCard';

export default ExhibitionCard;
