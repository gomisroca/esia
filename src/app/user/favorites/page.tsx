import ErrorPage from '@/app/_components/ErrorPage';
import ArtworkList from '@/app/_components/ui/ArtworkList';
import { getServerAuthSession } from '@/server/auth';
import { api } from '@/trpc/server';
import React from 'react';
import { type ArtworkWithArtist } from 'types';

async function FavoriteArtworksList() {
  try {
    // Get the server-side session,  block page if user is not the logged in user, if user is logged in user, let them rmeove saved artworks from the list
    const session = await getServerAuthSession();
    if (!session) return <ErrorPage message="Not logged in" />;

    const artworkData = await api.users.getFavoriteArtworks();
    const artworks: ArtworkWithArtist[] = artworkData.map((data) => data.artwork);

    if (!artworks || artworks.length === 0) return <ErrorPage message="No favorite artworks found" />;
    return (
      <div className="flex flex-col items-center justify-center gap-4">
        <h1 className="text-center text-3xl font-bold text-neutral-800 dark:text-neutral-200">Favorite Artworks</h1>
        <ArtworkList artworks={artworks} />
      </div>
    );
  } catch (_error: unknown) {
    return <ErrorPage message="Something went wrong while fetching your favorite artworks" />;
  }
}

export default FavoriteArtworksList;
