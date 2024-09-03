'use client';

/**
 * Renders a search bar component.
 *
 * @example
 * <SearchBar />
 */

import useDebounce from '@/app/hooks/useDebounce';
import { type ChangeEvent, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Dropdown from '../ui/Dropdown';
import { LuSearch } from 'react-icons/lu';

const SearchBar = () => {
  const router = useRouter();

  // Variables to track the search term
  const [searchTerm, setSearchTerm] = useState<string>('');
  const debouncedSearch = useDebounce(searchTerm, 1000);

  // Handles the search term change
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const searchTerm = e.target.value.toLowerCase();
    setSearchTerm(searchTerm.toLowerCase());
  };

  // Handles the search when the debounced search term changes
  useEffect(() => {
    if (debouncedSearch.trim().length > 0) {
      router.push(`/search/${debouncedSearch}`);
      setSearchTerm('');
    }
  }, [debouncedSearch, router]);

  return (
    <Dropdown
      className="right-0"
      closeOnChildClick={false}
      button={{
        name: 'searchButton',
        className:
          'rounded-r-none bg-neutral-200/30 drop-shadow-md dark:bg-neutral-800/30 md:rounded-md md:bg-transparent md:drop-shadow-none',
        text: <LuSearch role="search" className="size-[1.2rem] stroke-[3px] text-neutral-800 dark:text-neutral-200" />,
      }}>
      <input
        className="rounded-md bg-neutral-200 px-4 py-2 text-neutral-800 drop-shadow-md dark:bg-neutral-800 dark:text-neutral-200"
        type="text"
        value={searchTerm}
        onChange={handleChange}
        placeholder="Search..."
      />
    </Dropdown>
  );
};

export default SearchBar;
