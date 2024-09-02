'use client';

/**
 * Renders a style list dropdown component.
 *
 * @example
 * <StyleList />
 */

import { useState } from 'react';
import { api } from '@/trpc/react';
import { LuFilter, LuFilterX } from 'react-icons/lu';
import Button from '../ui/Button';
import Dropdown from '../ui/Dropdown';
import scrollToTop from '@/utils/scrollToTop';
import { useRouter } from 'next/navigation';

export default function StyleFilter() {
  const router = useRouter();
  // State variable to store the selected style
  const [selectedStyle, setSelectedStyle] = useState('');
  // Fetch styles from the server
  const { data: styles, isLoading, isFetching } = api.artworks.getStyles.useQuery();
  // Check if styles are available
  if (isLoading || isFetching || !styles) {
    return null;
  }
  // Callback function to handle style changes
  const handleStyleChange = (newStyle: string) => {
    setSelectedStyle(newStyle);
    if (!newStyle) {
      router.push('/');
      return;
    }
    router.push(`/style/${newStyle}`);
  };

  return (
    <div className="sticky z-10 mx-auto flex w-fit flex-row items-center justify-center gap-4">
      {/* Button to clear the selected style */}
      {selectedStyle && (
        <Button
          className="bg-neutral-200/30 drop-shadow-md dark:bg-neutral-800/30 md:bg-transparent md:drop-shadow-none"
          onClick={() => {
            setSelectedStyle('');
            handleStyleChange('');
            scrollToTop('instant');
          }}>
          <LuFilterX role="filter-off" className="text-neutral-800 dark:text-neutral-200" />
        </Button>
      )}
      {/* Dropdown component for the style list */}
      <Dropdown
        name={<LuFilter role="filter-button" className="stroke-[3px] text-neutral-800 dark:text-neutral-200" />}
        btnClassName="bg-neutral-200/30 drop-shadow-md dark:bg-neutral-800/30 md:bg-transparent md:drop-shadow-none"
        className="w-[90vw] border xl:absolute xl:right-0 xl:w-[52rem]">
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
              name={style.name!}
              className="border border-neutral-200/30 bg-neutral-200/90 drop-shadow-md dark:border-neutral-800/30 dark:bg-neutral-800/90">
              {style.name![0]!.toUpperCase() + style.name!.slice(1)}
            </Button>
          ))}
      </Dropdown>
    </div>
  );
}
