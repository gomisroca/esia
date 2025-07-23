'use client';

import { type Blog } from 'generated/prisma';
import Image from 'next/image';
import Link from 'next/link';
import { memo, useState } from 'react';
import Title from './Title';

function BlogSkeleton() {
  return <div data-testid="blog-skeleton" className="h-full w-full animate-pulse rounded-md bg-neutral-800/50" />;
}
function BlogCardContent({ blog }: { blog: Blog }) {
  const [loaded, setLoaded] = useState(false);

  return (
    <div
      className="group relative h-[30rem] w-[22rem] cursor-pointer overflow-hidden rounded-md md:h-[45rem] md:w-[30rem]"
      data-testid="exhibition-card">
      {/* Skeleton while image is loading */}
      {!loaded && <BlogSkeleton />}

      {/* Image */}
      <Image
        unoptimized
        onLoad={() => setLoaded(true)}
        src={blog.headerImage ?? '/ph.jpg'}
        alt={blog.name}
        width={300}
        height={200}
        className="h-full w-full object-cover transition-transform duration-500 ease-in-out"
      />

      <Link
        href={`/blogs/${blog.id}`}
        className="absolute inset-0 flex items-center justify-center bg-black/50 transition duration-500 ease-in-out group-hover:scale-105">
        <div className="min-h-2/3 m-4 w-full rounded-md border-2 border-neutral-200/20 bg-neutral-200/80 p-4 text-center text-neutral-800 drop-shadow-md transition-all duration-500 group-hover:bg-neutral-200 dark:border-neutral-800/20 dark:bg-neutral-800/80 dark:text-neutral-200 group-hover:dark:bg-neutral-800">
          <Title className="mb-2">{blog.name}</Title>
          <p className="font-bold">{blog.date.toDateString()}</p>
          <div
            className="overflow-hidden rounded-md bg-slate-900/10 p-2 text-left md:p-4"
            dangerouslySetInnerHTML={{ __html: blog.content.slice(0, 250) + '...' }}
          />
        </div>
      </Link>
    </div>
  );
}
const BlogCard = memo((props: Readonly<{ blog: Blog }>) => {
  return <BlogCardContent {...props} />;
});
BlogCard.displayName = 'BlogCard';

export default BlogCard;
