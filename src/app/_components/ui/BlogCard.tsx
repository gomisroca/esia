'use client';

import { type Blog } from 'generated/prisma';
import Link from 'next/link';
import { memo } from 'react';
import Title from './Title';
import Card from './Card';

function BlogCardContent({ blog }: { blog: Blog }) {
  return (
    <Card image={blog.headerImage ?? undefined} name={blog.name}>
      <section className="flex flex-col gap-4">
        <Link
          href={`/blogs/${blog.id}`}
          className="flex cursor-pointer transition-transform duration-200 ease-in-out hover:scale-110">
          <Title>{blog.name}</Title>
        </Link>
        <p className="font-bold">{blog.date.toDateString()}</p>
      </section>
      <div className="rounded-sm bg-slate-900/10 p-2 text-left md:p-4">
        <p dangerouslySetInnerHTML={{ __html: blog.content }} className="line-clamp-5" />
      </div>
    </Card>
  );
}
const BlogCard = memo((props: Readonly<{ blog: Blog }>) => {
  return <BlogCardContent {...props} />;
});
BlogCard.displayName = 'BlogCard';

export default BlogCard;
