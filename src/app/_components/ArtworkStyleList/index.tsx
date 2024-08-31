'use client';

/**
 * Renders a list of artworks with infinite scrolling.
 *
 * @example
 * <ArtworkStyleList />
 */

import { useState } from 'react';
import { StyleList } from './StyleList';
import LoadingBar from '../ui/LoadingBar';
import { GeneralList } from './GeneralList';
import { StyleBasedList } from './StyleBasedList';

export function ArtworkStyleList() {
  // State variable to indicate whether the general list of artworks is loading
  const [listLoading, setListLoading] = useState(false);
  // State variable to store the selected style
  const [style, setStyle] = useState('');

  // Callback function to handle style changes
  const handleStyleChange = (newStyle: string) => {
    setStyle(newStyle);
  };

  return (
    <>
      <StyleList handleStyleChange={handleStyleChange} />

      <div className="mx-auto flex w-full flex-wrap items-center justify-center gap-2" role="list">
        {style ? (
          <StyleBasedList style={style} listIsLoading={(e) => setListLoading(e)} />
        ) : (
          <GeneralList listIsLoading={(e) => setListLoading(e)} />
        )}
      </div>

      {/* Loading bar to indicate loading state */}
      {listLoading && <LoadingBar />}
    </>
  );
}
