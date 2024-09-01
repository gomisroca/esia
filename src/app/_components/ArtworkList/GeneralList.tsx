'use client';

/**
 * Renders a list of artworks with infinite scrolling.
 *
 * @param {function} isLoading - Callback function to indicate whether the list is loading.
 *
 * @example
 * <GeneralList listIsLoading={(isLoading) => console.log(`List is loading: ${isLoading}`)} />
 */

import { useState, useEffect } from 'react';
import { useInView } from 'react-intersection-observer';
import { api } from '@/trpc/react';
import { type ArtworkWithArtist } from 'types';
import { ArtworkCard } from '../ui/ArtworkCard';

// Page size for the artwork list
const PAGE_SIZE = 10;

export function GeneralList({ listIsLoading }: { listIsLoading: (e: boolean) => void }) {
  // Current page number
  const [page, setPage] = useState(0);
  // InView hook
  const { ref, inView } = useInView({ threshold: 1.0 });
  // State variable to store all artworks
  const [allArtworks, setAllArtworks] = useState<ArtworkWithArtist[]>([]);

  // Fetch new artworks from the server
  const {
    data: artworks,
    isLoading,
    isFetching,
  } = api.artworks.getAll.useQuery({
    skip: page * PAGE_SIZE,
    take: PAGE_SIZE,
  });

  // Effect to load more artworks when the user reaches the end of the list.
  useEffect(() => {
    if (inView && !isFetching && artworks && artworks.length === PAGE_SIZE) {
      setPage((prev) => prev + 1);
    }
  }, [inView, isFetching, artworks]);

  // Effect to update the listIsLoading callback.
  useEffect(() => {
    listIsLoading(isLoading);
  }, [isLoading, listIsLoading]);

  // Effect to update the allArtworks state with new artworks.
  useEffect(() => {
    if (artworks && artworks.length > 0) {
      setAllArtworks((prev) => [...prev, ...artworks]);
    }
  }, [artworks]);

  return (
    <>
      {allArtworks.length > 0 && (
        <>
          {allArtworks.map((artwork) => (
            <ArtworkCard key={artwork.id} artwork={artwork} />
          ))}
        </>
      )}
      {/* Empty div to trigger the inView effect */}
      <div ref={ref} className="h-20"></div>
    </>
  );
}
