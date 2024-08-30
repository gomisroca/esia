'use client';

/**
 * Renders a style list dropdown component.
 *
 * @param {function} handleStyleChange - A callback function for the parent component to handle style changes.
 *
 * @example
 * <StyleList handleStyleChange={(style) => console.log(`Style changed to: ${style}`)} />
 */

import { useState } from 'react';
import { api } from '@/trpc/react';
import { LuFilter, LuFilterX } from 'react-icons/lu';
import Button from '../ui/Button';
import Dropdown from '../ui/Dropdown';
import scrollToTop from '@/utils/scrollToTop';

export function StyleList({ handleStyleChange }: { handleStyleChange: (style: string) => void }) {
  // State variable to store the selected style
  const [selectedStyle, setSelectedStyle] = useState('');
  // Fetch styles from the server
  const { data: styles, isLoading, isFetching } = api.artwork.getStyles.useQuery();
  // Check if styles are available
  if (isLoading || isFetching || !styles) {
    return null;
  }

  return (
    <div className="sticky top-6 z-10 mx-auto mb-2 flex w-fit flex-row items-center justify-center gap-2">
      {/* Dropdown component for the style list */}
      <Dropdown
        name={<LuFilter role="filter-button" className="stroke-[3px] text-neutral-800 dark:text-neutral-200" />}
        btnClassName="bg-neutral-200/30 drop-shadow-md  dark:bg-neutral-800/30"
        className="left-[50%] w-[24rem] translate-x-[-50%] transform border xl:w-[52rem]">
        {styles
          .sort((a, b) => (a.count > b.count ? -1 : 1))
          .map((style) => (
            <Button
              key={style.name}
              onClick={() => {
                setSelectedStyle(style.name!);
                handleStyleChange(style.name!);
                scrollToTop('instant');
              }}
              disabled={selectedStyle === style.name}
              className="border border-neutral-200/30 bg-neutral-200/90 drop-shadow-md dark:border-neutral-800/30 dark:bg-neutral-800/90">
              {style.name![0]!.toUpperCase() + style.name!.slice(1)}
            </Button>
          ))}
      </Dropdown>
      {/* Button to clear the selected style */}
      {selectedStyle && (
        <Button
          className="border bg-neutral-200/30 drop-shadow-md dark:border-neutral-800/30 dark:bg-neutral-800/30"
          onClick={() => {
            setSelectedStyle('');
            handleStyleChange('');
            scrollToTop('instant');
          }}>
          <LuFilterX role="filter-off" className="text-neutral-800 dark:text-neutral-200" />
        </Button>
      )}
    </div>
  );
}
