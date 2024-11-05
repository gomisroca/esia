import ProtectedRoute from '@/app/_components/ProtectedRoute';
import { api } from '@/trpc/server';
import Image from 'next/image';
import Link from 'next/link';
import React from 'react';

async function ExhibitionUpdateList() {
  const exhibitions = await api.exhibitions.getAll({ limit: null, cursor: null });

  return (
    <ProtectedRoute>
      <div className="flex flex-col gap-4">
        {exhibitions.exhibitions.map((exhibition) => (
          <Link
            key={exhibition.id}
            href={`/admin/exhibitions/update/${exhibition.id}`}
            className="flex flex-row gap-4 rounded-lg bg-neutral-200 p-4 text-neutral-800 duration-200 hover:bg-neutral-300 active:scale-x-110 active:bg-neutral-300 active:duration-100 dark:bg-neutral-800 dark:text-neutral-200 dark:hover:bg-neutral-700 dark:active:bg-neutral-700">
            <Image
              src={exhibition.image ?? '/ph.jpg'}
              alt={exhibition.name}
              width={200}
              height={200}
              className="rounded-md"
            />
            <div className="my-2 flex w-1/2 flex-col">
              <p className="text-xl font-bold">{exhibition.name}</p>
              <div className="my-4">
                <p>
                  {exhibition.start.toLocaleDateString()} - {exhibition.end.toLocaleDateString()}
                </p>
                <p dangerouslySetInnerHTML={{ __html: exhibition.description }} className="line-clamp-5" />
              </div>
            </div>
          </Link>
        ))}
      </div>
    </ProtectedRoute>
  );
}

export default ExhibitionUpdateList;
