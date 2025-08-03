'use client';

/**
 * Renders a search bar component.
 *
 * @example
 * <SearchBar />
 */

import { useRouter } from 'next/navigation';
import { type ChangeEvent, useEffect, useState } from 'react';
import { LuSearch } from 'react-icons/lu';

import useDebounce from '@/app/hooks/useDebounce';

import Dropdown from '../ui/Dropdown';

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
        ariaLabel: 'Search Button',
        name: 'searchButton',
        className: 'rounded-r-none md:rounded-sm',
        text: <LuSearch role="search" className="size-[1.2rem] stroke-[3px]" />,
      }}>
      <input
        aria-label="Search Input"
        className="rounded-sm bg-neutral-50 px-4 py-2 drop-shadow-md dark:bg-neutral-950"
        type="text"
        value={searchTerm}
        onChange={handleChange}
        placeholder="Search..."
      />
    </Dropdown>
  );
};

export default SearchBar;
