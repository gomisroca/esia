import Image from 'next/image';
import Link from 'next/link';
import React from 'react';

import ProtectedRoute from '@/app/_components/ProtectedRoute';
import { api } from '@/trpc/server';

async function ArtworkUpdateList() {
  const artworks = await api.artworks.getAll({ artist: true, limit: null, cursor: null });

  return (
    <ProtectedRoute>
      <div className="flex flex-col gap-4">
        {artworks.artworks.map((artwork) => (
          <Link
            key={artwork.id}
            href={`/admin/artworks/update/${artwork.id}`}
            className="flex flex-row gap-4 rounded-lg bg-neutral-200 p-4 text-neutral-800 duration-200 hover:bg-neutral-300 active:scale-x-110 active:bg-neutral-300 active:duration-100 dark:bg-neutral-800 dark:text-neutral-200 dark:hover:bg-neutral-700 dark:active:bg-neutral-700">
            <Image
              src={artwork.image ?? '/ph.jpg'}
              alt={artwork.name}
              width={200}
              height={200}
              className="rounded-md"
            />
            <div className="my-2 flex w-1/2 flex-col">
              <p className="text-xl font-bold">{artwork.name}</p>
              <p className="text-lg">{artwork.artist.name}</p>
              <div className="my-4">
                <p>{artwork.medium}</p>
                <p>{artwork.date}</p>
                <p>{artwork.origin}</p>
                <p>{artwork.style}</p>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </ProtectedRoute>
  );
}

export default ArtworkUpdateList;
