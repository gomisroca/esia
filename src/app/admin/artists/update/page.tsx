import Link from 'next/link';

import ProtectedRoute from '@/app/_components/ProtectedRoute';
import { api } from '@/trpc/server';

export default async function ArtistUpdateList() {
  const { items: artists } = await api.artists.getAll({ limit: 100 });

  return (
    <ProtectedRoute>
      <div className="flex flex-col gap-4">
        {artists.map((artist) => (
          <Link
            key={artist.id}
            href={`/admin/artists/update/${artist.id}`}
            className="flex flex-row gap-4 rounded-sm bg-neutral-200 p-4 duration-200 hover:bg-neutral-300 active:scale-x-110 active:bg-neutral-300 active:duration-100 dark:bg-neutral-800 dark:hover:bg-neutral-700 dark:active:bg-neutral-700">
            <p className="text-xl font-bold">{artist.name}</p>
          </Link>
        ))}
      </div>
    </ProtectedRoute>
  );
}
