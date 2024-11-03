import Link from 'next/link';
import React from 'react';
import { FaCalendarAlt } from 'react-icons/fa';

function ExhibitionButton() {
  return (
    <Link
      href="/exhibitions"
      className="flex flex-row items-center justify-center rounded-md p-2 font-bold text-neutral-800 backdrop-blur-sm transition-all duration-200 hover:bg-neutral-200 active:scale-x-110 active:bg-neutral-300 active:duration-100 dark:text-neutral-200 dark:hover:bg-neutral-800 active:dark:bg-neutral-700">
      <span className="sr-only">Exhibitions</span>
      <FaCalendarAlt className="size-[1.2rem] stroke-[3px] text-neutral-800 dark:text-neutral-200" />
    </Link>
  );
}

export default ExhibitionButton;
