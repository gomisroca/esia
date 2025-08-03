import Link from 'next/link';
import React from 'react';
import { FaCalendarAlt } from 'react-icons/fa';

function ExhibitionButton() {
  return (
    <Link
      aria-label="Exhibitions"
      href="/exhibitions"
      className="flex cursor-pointer flex-row items-center justify-center rounded-sm rounded-r-none bg-white/60 p-2 font-bold drop-shadow-md transition-all duration-200 ease-in hover:scale-110 hover:bg-white active:scale-95 active:duration-100 md:rounded-sm dark:bg-black/60 dark:hover:bg-black">
      <span className="sr-only">Exhibitions</span>
      <FaCalendarAlt className="size-[1.2rem] stroke-[3px]" />
    </Link>
  );
}

export default ExhibitionButton;
