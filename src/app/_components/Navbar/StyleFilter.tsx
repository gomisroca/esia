'use client';

import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useMemo, useState } from 'react';
import { LuFilter, LuFilterX } from 'react-icons/lu';

import { api } from '@/trpc/react';
import scrollToTop from '@/utils/scrollToTop';

import Button from '../ui/Button';
import Dropdown from '../ui/Dropdown';

interface Style {
  name: string;
  count: number;
}

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
        ariaLabel: 'Filter Dropdown',
        text: <LuFilter role="filter-dropdown" className="size-[1.2rem] stroke-[3px]" />,
        name: 'filterDropdown',
        className: 'rounded-r-none md:rounded-sm',
      }}
      className="absolute right-0 w-[95vw] border xl:w-208">
      {sortedStyles.map((style) => (
        <Button
          key={style.name}
          onClick={() => {
            setSelectedStyle(style.name);
            handleStyleChange(style.name);
            scrollToTop('instant');
          }}
          disabled={selectedStyle === style.name}
          name={style.name}
          className="border border-neutral-200/30 bg-neutral-200/90 drop-shadow-md dark:border-neutral-800/30 dark:bg-neutral-800/90">
          {style.name[0]!.toUpperCase() + style.name.slice(1)}
        </Button>
      ))}
    </Dropdown>
  );
}

export function FilterOffButton({ handleClearFilter }: { handleClearFilter: () => void }) {
  return (
    <Button
      ariaLabel="Clear Filter"
      name="clearFilter"
      className="rounded-r-none bg-neutral-200/30 drop-shadow-md md:rounded-sm md:bg-transparent md:drop-shadow-none dark:bg-neutral-800/30"
      onClick={handleClearFilter}>
      <span className="sr-only">Clear Filter</span>
      <LuFilterX role="filter-off" className="size-[1.2rem]" />
    </Button>
  );
}

function StyleFilterSkeleton() {
  return (
    <div className="z-10 mx-auto flex w-fit flex-col items-center justify-center gap-4">
      <Button className="rounded-r-none bg-neutral-200/30 drop-shadow-md md:rounded-sm md:bg-transparent md:drop-shadow-none dark:bg-neutral-800/30">
        <span className="sr-only">Filter Skeleton</span>
        <LuFilter className="size-[1.2rem] stroke-[3px]" />
      </Button>
    </div>
  );
}

function StyleFilter() {
  const router = useRouter();
  const pathname = usePathname();
  const [selectedStyle, setSelectedStyle] = useState('');

  const { data: styles, isPending } = api.styles.getAll.useQuery({});

  const sortedStyles = useMemo(() => {
    if (!styles) return [];
    return [...styles].filter((s): s is Style => s.name !== null).sort((a, b) => b.count - a.count);
  }, [styles]);

  const handleStyleChange = (newStyle: string) => {
    setSelectedStyle(newStyle);
    if (!newStyle) {
      router.push('/');
      return;
    }
    router.push(`/style/${newStyle.toLocaleLowerCase().replace(/\s+/g, '+')}`);
  };

  const handleClearFilter = () => {
    setSelectedStyle('');
    handleStyleChange('');
  };

  useEffect(() => {
    if (!pathname.includes('style/')) {
      setSelectedStyle('');
    }
  }, [pathname]);

  if (isPending) return <StyleFilterSkeleton />;
  if (!sortedStyles.length) return null;

  return (
    <div className="z-10 mx-auto flex w-fit flex-col items-center justify-center gap-4">
      <FilterDropdown
        sortedStyles={sortedStyles}
        selectedStyle={selectedStyle}
        setSelectedStyle={setSelectedStyle}
        handleStyleChange={handleStyleChange}
      />
      {selectedStyle && <FilterOffButton handleClearFilter={handleClearFilter} />}
    </div>
  );
}

export default StyleFilter;
