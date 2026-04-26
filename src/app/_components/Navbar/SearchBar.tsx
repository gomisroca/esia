'use client';

import { useRouter } from 'next/navigation';
import { type ChangeEvent, useEffect, useState } from 'react';
import { LuSearch } from 'react-icons/lu';

import useDebounce from '@/app/hooks/useDebounce';

import Dropdown from '../ui/Dropdown';

export default function SearchBar() {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState('');
  const debouncedSearch = useDebounce(searchTerm, 1000);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value.toLowerCase());
  };

  useEffect(() => {
    if (debouncedSearch.trim().length > 0) {
      router.push(`/search/${encodeURIComponent(debouncedSearch)}`);
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
}
