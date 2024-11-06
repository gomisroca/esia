import Link from 'next/link';
import React from 'react';
import { FaNewspaper } from 'react-icons/fa6';

function BlogButton() {
  return (
    <Link
      href="/blogs"
      className="flex flex-row items-center justify-center rounded-md rounded-r-none bg-neutral-200/30 p-2 font-bold text-neutral-800 drop-shadow-md backdrop-blur-sm transition-all duration-200 hover:bg-neutral-200 active:scale-x-110 active:bg-neutral-300 active:duration-100 dark:bg-neutral-800/30 dark:text-neutral-200 dark:hover:bg-neutral-800 active:dark:bg-neutral-700 md:rounded-md md:bg-transparent md:drop-shadow-none">
      <span className="sr-only">Blogs</span>
      <FaNewspaper className="size-[1.2rem] stroke-[3px] text-neutral-800 dark:text-neutral-200" />
    </Link>
  );
}

export default BlogButton;
