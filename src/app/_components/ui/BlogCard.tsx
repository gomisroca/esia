'use client';

import { type Blog } from 'generated/prisma';
import Link from 'next/link';
import { memo } from 'react';
import Title from './Title';
import Card from './Card';

function BlogCardContent({ blog }: { blog: Blog }) {
  return (
    <Card image={blog.headerImage ?? undefined} name={blog.name}>
      <Link
        href={`/blogs/${blog.id}`}
        className="absolute inset-0 flex items-center justify-center bg-black/50 transition duration-500 ease-in-out group-hover:scale-105">
        <div className="m-4 min-h-2/3 w-full rounded-md border-2 border-neutral-200/20 bg-neutral-200/80 p-4 text-center text-neutral-800 drop-shadow-md transition-all duration-500 group-hover:bg-neutral-200 dark:border-neutral-800/20 dark:bg-neutral-800/80 dark:text-neutral-200 group-hover:dark:bg-neutral-800">
          <Title className="mb-2">{blog.name}</Title>
          <p className="font-bold">{blog.date.toDateString()}</p>
          <div
            className="overflow-hidden rounded-md bg-slate-900/10 p-2 text-left md:p-4"
            dangerouslySetInnerHTML={{ __html: blog.content.slice(0, 250) + '...' }}
          />
        </div>
      </Link>
    </Card>
  );
}
const BlogCard = memo((props: Readonly<{ blog: Blog }>) => {
  return <BlogCardContent {...props} />;
});
BlogCard.displayName = 'BlogCard';

export default BlogCard;
