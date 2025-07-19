import { api } from '@/trpc/server';

import BlogCard from '../_components/ui/BlogCard';

export default async function BlogList() {
  const blogs = await api.blogs.getAll();

  return (
    <div className="mx-auto flex w-full flex-wrap items-center justify-center gap-2" role="list">
      {blogs.map((blog) => (
        <div key={blog.id}>
          <BlogCard blog={blog} />
        </div>
      ))}
    </div>
  );
}
