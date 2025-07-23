import Link from 'next/link';
import React from 'react';

import ProtectedRoute from '@/app/_components/ProtectedRoute';
import { api } from '@/trpc/server';

async function ArtistUpdateList() {
  const artists = await api.artists.getAll({});

  return (
    <ProtectedRoute>
      <div className="flex flex-col gap-4">
        {artists.map((artist) => (
          <Link
            key={artist.id}
            href={`/admin/artists/update/${artist.id}`}
            className="flex flex-row gap-4 rounded-lg bg-neutral-200 p-4 text-neutral-800 duration-200 hover:bg-neutral-300 active:scale-x-110 active:bg-neutral-300 active:duration-100 dark:bg-neutral-800 dark:text-neutral-200 dark:hover:bg-neutral-700 dark:active:bg-neutral-700">
            <p className="text-xl font-bold">{artist.name}</p>
          </Link>
        ))}
      </div>
    </ProtectedRoute>
  );
}

export default ArtistUpdateList;
