'use client';

import { type Blog } from '@prisma/client';
import { memo } from 'react';

import Card from './Card';
import Link from './Link';
import Title from './Title';

function BlogCardContent({ blog }: { blog: Blog }) {
  return (
    <Card image={blog.headerImage ?? undefined} name={blog.name}>
      <section className="flex flex-col gap-4">
        <Title>{blog.name}</Title>
        <p className="font-bold">{blog.date.toDateString()}</p>
      </section>
      <div className="my-2 flex-1 rounded-sm bg-slate-900/10 p-2 text-left md:p-4">
        <p dangerouslySetInnerHTML={{ __html: blog.content }} className="line-clamp-5" />
      </div>
      <Link href={`/blogs/${blog.id}`} className="mb-0">
        Read More
      </Link>
    </Card>
  );
}
const BlogCard = memo((props: Readonly<{ blog: Blog }>) => {
  return <BlogCardContent {...props} />;
});
BlogCard.displayName = 'BlogCard';

export default BlogCard;
