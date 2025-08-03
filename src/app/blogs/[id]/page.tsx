import Image from 'next/image';
import { notFound } from 'next/navigation';

import Title from '@/app/_components/ui/Title';
import { api } from '@/trpc/server';

async function BlogSingle({ params }: { params: Promise<{ id: string }> }) {
  const paramsData = await params;
  const blog = await api.blogs.getUnique({ id: paramsData.id });
  if (!blog) return notFound();
  return (
    <div className="m-auto overflow-hidden rounded-sm bg-slate-300/95 dark:bg-slate-900/95">
      <Image
        unoptimized
        src={blog.headerImage ?? '/ph.jpg'}
        alt={blog.name}
        width={500}
        height={250}
        className="h-full w-full object-cover transition-transform duration-200 ease-in"
      />
      <div className="flex flex-col gap-2 p-2 text-center md:p-4">
        <div>
          <Title>{blog.name}</Title>

          <p className="font-bold">{blog.date.toDateString()}</p>
        </div>
        <p
          className="rounded-sm bg-slate-900/10 p-2 text-left whitespace-pre-line md:p-4"
          dangerouslySetInnerHTML={{ __html: blog.content }}
        />
      </div>
    </div>
  );
}

export default BlogSingle;
