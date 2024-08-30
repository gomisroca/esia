'use client';

/**
 * Renders a list of artworks with infinite scrolling.
 *
 * @example
 * <ArtworkStyleList />
 */

import { api } from '@/trpc/react';
import { useState, useEffect } from 'react';
import { StyleList } from './StyleList';
import { ArtworkCard } from './ArtworkCard';
import LoadingBar from '../ui/LoadingBar';
import { ArtworkList } from './ArtworkList';
import { useInView } from 'react-intersection-observer';
import { type ArtworkWithArtist } from 'types';

// Page size for the artwork list
const PAGE_SIZE = 10;

export function ArtworkStyleList() {
  // Current page number
  const [page, setPage] = useState(0);
  // State variable to indicate whether the general list of artworks is loading
  const [listLoading, setListLoading] = useState(false);
  // InView hook
  const { ref, inView } = useInView({ threshold: 1.0 });
  // State variable to store the selected style
  const [style, setStyle] = useState('');
  // State variable to store all artworks
  const [allArtworks, setAllArtworks] = useState<ArtworkWithArtist[]>([]);

  // Fetch new artworks from the server
  const {
    data: artworks,
    isLoading,
    isFetching,
  } = api.artwork.getAllInStyle.useQuery({
    style,
    skip: page * PAGE_SIZE,
    take: PAGE_SIZE,
  });

  // Effect to reset the page and allArtworks state when the style changes.
  useEffect(() => {
    if (style) {
      setPage(0);
      setAllArtworks([]);
    }
  }, [style]);

  // Effect to load more artworks when the user reaches the end of the list.
  useEffect(() => {
    if (inView && !isFetching && artworks && artworks.length === PAGE_SIZE) {
      setPage((prev) => prev + 1);
    }
  }, [inView, isFetching, artworks]);

  // Effect to update the allArtworks state with new artworks.
  useEffect(() => {
    if (artworks && artworks.length > 0) {
      setAllArtworks((prev) => [...prev, ...artworks]);
    }
  }, [artworks]);

  // Callback function to handle style changes
  const handleStyleChange = (newStyle: string) => {
    setStyle(newStyle);
  };

  return (
    <div className="min-h-screen w-full">
      <StyleList handleStyleChange={handleStyleChange} />
      {style && allArtworks ? (
        <div className="mx-auto flex flex-wrap items-center justify-center gap-2" role="list">
          {allArtworks.map((artwork) => (
            <ArtworkCard key={artwork.id} artwork={artwork} />
          ))}
        </div>
      ) : (
        <ArtworkList listIsLoading={(e) => setListLoading(e)} />
      )}
      {/* Empty div to trigger the inView effect */}
      <div ref={ref} className="h-20"></div>
      {/* Loading bar to indicate loading state */}
      {(isLoading || listLoading) && <LoadingBar />}
    </div>
  );
}
