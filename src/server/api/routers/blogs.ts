import { TRPCError } from '@trpc/server';
import { z } from 'zod/v4';

import { adminProcedure, createTRPCRouter, publicProcedure } from '@/server/api/trpc';
import handlePrismaNotFound from '@/utils/handlePrismaError';
import { resolveImageLink } from '@/utils/uploadImage';

const blogInput = z.object({
  name: z.string().min(1, 'Name is required'),
  content: z.string().min(1, 'Content is required'),
  date: z.date(),
  headerImage: z.string().optional(),
});

export const blogsRouter = createTRPCRouter({
  getUnique: publicProcedure.input(z.object({ id: z.cuid() })).query(async ({ ctx, input }) => {
    const blog = await ctx.db.blog.findUnique({ where: { id: input.id } });
    if (!blog) throw new TRPCError({ code: 'NOT_FOUND', message: 'Blog not found' });
    return blog;
  }),

  getAll: publicProcedure.query(({ ctx }) => {
    return ctx.db.blog.findMany({ orderBy: { date: 'desc' } });
  }),

  create: adminProcedure.input(blogInput).mutation(async ({ ctx, input }) => {
    const imageLink = await resolveImageLink(input.headerImage, 'blog');
    const blog = await ctx.db.blog.create({
      data: {
        name: input.name,
        content: input.content,
        date: input.date,
        headerImage: imageLink,
      },
    });
    return { id: blog.id };
  }),

  update: adminProcedure.input(z.object({ id: z.cuid(), data: blogInput })).mutation(async ({ ctx, input }) => {
    const existing = await ctx.db.blog.findUnique({ where: { id: input.id } });
    if (!existing) throw new TRPCError({ code: 'NOT_FOUND', message: 'Blog not found' });

    const imageLink = await resolveImageLink(input.data.headerImage, 'blog');

    await ctx.db.blog
      .update({
        where: { id: input.id },
        data: {
          name: input.data.name,
          content: input.data.content,
          date: input.data.date,
          headerImage: imageLink ?? existing.headerImage,
        },
      })
      .catch(handlePrismaNotFound('Blog'));
  }),

  delete: adminProcedure.input(z.object({ id: z.cuid() })).mutation(async ({ ctx, input }) => {
    await ctx.db.blog.delete({ where: { id: input.id } }).catch(handlePrismaNotFound('Blog'));
  }),
});
