import Image from 'next/image';
import Link from 'next/link';
import React from 'react';

import ProtectedRoute from '@/app/_components/ProtectedRoute';
import { api } from '@/trpc/server';

async function BlogUpdateList() {
  const blogs = await api.blogs.getAll();

  return (
    <ProtectedRoute>
      <div className="flex flex-col gap-4">
        {blogs.map((blog) => (
          <Link
            key={blog.id}
            href={`/admin/blogs/update/${blog.id}`}
            className="flex flex-row gap-4 rounded-lg bg-neutral-200 p-4 duration-200 hover:bg-neutral-300 active:scale-x-110 active:bg-neutral-300 active:duration-100 dark:bg-neutral-800 dark:hover:bg-neutral-700 dark:active:bg-neutral-700">
            <Image
              src={blog.headerImage ?? '/ph.jpg'}
              alt={blog.name}
              width={200}
              height={200}
              className="rounded-md"
            />
            <div className="my-2 flex w-1/2 flex-col">
              <p className="text-xl font-bold">{blog.name}</p>
              <div className="my-4">
                <p>{blog.date.toLocaleDateString()}</p>
                <p className="line-clamp-5">{blog.content}</p>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </ProtectedRoute>
  );
}

export default BlogUpdateList;
