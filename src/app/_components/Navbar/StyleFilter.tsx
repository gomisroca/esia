'use client';

/**
 * Renders a style filter dropdown component.
 *
 * @example
 * <StyleFilter />
 */

import { useEffect, useMemo, useState } from 'react';
import { api } from '@/trpc/react';
import { LuFilter, LuFilterX } from 'react-icons/lu';
import Button from '../ui/Button';
import Dropdown from '../ui/Dropdown';
import scrollToTop from '@/utils/scrollToTop';
import { usePathname, useRouter } from 'next/navigation';

interface Style {
  name: string | null;
  count: number;
}

/**
 * Renders a dropdown component for the style filter.
 *
 * @param sortedStyles - An array of styles sorted by count.
 * @param selectedStyle - The currently selected style.
 * @param setSelectedStyle - A function to set the selected style.
 * @param handleStyleChange - A function to handle style changes.
 *
 * @example
 * <FilterDropdown
 *   sortedStyles={sortedStyles}
 *   selectedStyle={selectedStyle}
 *   setSelectedStyle={setSelectedStyle}
 *   handleStyleChange={handleStyleChange}
 * />
 */
export function FilterDropdown({
  sortedStyles,
  selectedStyle,
  setSelectedStyle,
  handleStyleChange,
}: {
  sortedStyles: Style[];
  selectedStyle: string;
  setSelectedStyle: (style: string) => void;
  handleStyleChange: (style: string) => void;
}) {
  return (
    <Dropdown
      button={{
        ariaLabel: 'Filter Button',
        text: (
          <LuFilter
            role="filter-button"
            className="size-[1.2rem] stroke-[3px] text-neutral-800 dark:text-neutral-200"
          />
        ),
        name: 'filterButton',
        className:
          'bg-neutral-200/30 drop-shadow-md dark:bg-neutral-800/30 md:bg-transparent md:drop-shadow-none rounded-r-none md:rounded-md',
      }}
      className="absolute right-0 w-[95vw] border xl:w-[52rem]">
      {sortedStyles.map((style) => (
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
  );
}

/**
 * Renders a button to clear the selected style.
 *
 * @param handleClearFilter - A function to handle clearing the selected style.
 *
 * @example
 * <FilterOffButton handleClearFilter={handleClearFilter} />
 */
export function FilterOffButton({ handleClearFilter }: { handleClearFilter: () => void }) {
  return (
    <Button
      ariaLabel="Clear Filter Button"
      name="filterOffButton"
      className="rounded-r-none bg-neutral-200/30 drop-shadow-md dark:bg-neutral-800/30 md:rounded-md md:bg-transparent md:drop-shadow-none"
      onClick={handleClearFilter}>
      <LuFilterX role="filter-off" className="size-[1.2rem] text-neutral-800 dark:text-neutral-200" />
    </Button>
  );
}

function StyleFilterSkeleton() {
  return (
    <div className="z-10 mx-auto flex w-fit flex-col items-center justify-center gap-4">
      <Button className="rounded-r-none bg-neutral-200/30 drop-shadow-md dark:bg-neutral-800/30 md:rounded-md md:bg-transparent md:drop-shadow-none">
        <LuFilter className="size-[1.2rem] stroke-[3px] text-neutral-800 dark:text-neutral-200" />
      </Button>
    </div>
  );
}

function StyleFilter() {
  const router = useRouter();
  const pathname = usePathname();
  const [selectedStyle, setSelectedStyle] = useState('');

  // Fetch styles from the server
  const { data: styles, isLoading, isFetching } = api.artworks.getStyles.useQuery();

  // Memoize the sorted styles to avoid re-sorting on every render
  const sortedStyles = useMemo(() => {
    if (!styles) return [];
    return styles.sort((a, b) => (a.count > b.count ? -1 : 1));
  }, [styles]);

  // Handle style changes
  const handleStyleChange = (newStyle: string) => {
    setSelectedStyle(newStyle);
    if (!newStyle) {
      router.push('/');
      return;
    }
    const encodedStyle = newStyle.toLocaleLowerCase().replace(/\s+/g, '+');
    router.push(`/style/${encodedStyle}`);
  };

  // Handle clear filter button click
  const handleClearFilter = () => {
    setSelectedStyle('');
    handleStyleChange('');
  };

  useEffect(() => {
    if (!pathname.includes('style/')) {
      setSelectedStyle('');
    }
  }, [pathname]);

  // Render a skeleton if the styles are loading or fetching
  if (isLoading || isFetching || !styles) {
    return <StyleFilterSkeleton />;
  }

  return (
    <div className="z-10 mx-auto flex w-fit flex-col items-center justify-center gap-4">
      {/* Dropdown component for the style list */}
      <FilterDropdown
        sortedStyles={sortedStyles}
        selectedStyle={selectedStyle}
        setSelectedStyle={setSelectedStyle}
        handleStyleChange={handleStyleChange}
      />
      {/* Button to clear the selected style */}
      {selectedStyle && <FilterOffButton handleClearFilter={handleClearFilter} />}
    </div>
  );
}

export default StyleFilter;
