import Title from '@/app/_components/ui/Title';
import { api } from '@/trpc/server';
import Image from 'next/image';
import { notFound } from 'next/navigation';

async function BlogSingle({ params }: { params: { id: string } }) {
  const blog = await api.blogs.getUnique(params.id);
  if (!blog) return notFound();
  return (
    <div className="m-auto overflow-hidden rounded-md bg-slate-300/95 dark:bg-slate-900/95">
      <Image
        unoptimized
        src={blog.headerImage ?? '/ph.jpg'}
        alt={blog.name}
        width={500}
        height={250}
        className="h-full w-full object-cover transition-transform duration-500 ease-in-out"
      />
      <div className="flex flex-col gap-2 p-2 text-center text-neutral-800 dark:text-neutral-200 md:p-4">
        <div>
          <Title>{blog.name}</Title>
          <p className="font-bold">{blog.date.toLocaleDateString()}</p>
        </div>
        <p
          className="whitespace-pre-line rounded-md bg-slate-900/10 p-2 text-left md:p-4"
          dangerouslySetInnerHTML={{ __html: blog.content }}
        />
      </div>
    </div>
  );
}

export default BlogSingle;
