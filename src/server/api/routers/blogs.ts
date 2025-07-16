import { TRPCError } from '@trpc/server';
import { z } from 'zod';

import { env } from '@/env';
import uploadImage from '@/utils/uploadImage';

import { createTRPCRouter, protectedProcedure, publicProcedure } from '../trpc';

export const blogsRouter = createTRPCRouter({
  getUnique: publicProcedure
    .input(
      z.object({
        id: z.string(),
      })
    )
    .query(({ ctx, input }) => {
      try {
        return ctx.db.blog.findUnique({ where: { id: input.id } });
      } catch (error) {
        if (error instanceof TRPCError) {
          throw error;
        } else {
          throw new TRPCError({ code: 'NOT_FOUND', message: 'Blog not found' });
        }
      }
    }),
  getAll: publicProcedure
    .input(
      z.object({
        limit: z.number().min(1).max(100).nullish(),
        cursor: z.string().nullish(),
      })
    )
    .query(async ({ ctx, input }) => {
      try {
        const limit = input.limit ?? 10;
        const { cursor } = input;
        const blogs = await ctx.db.blog.findMany({
          take: limit + 1,
          cursor: cursor ? { id: cursor } : undefined,
          orderBy: { date: 'desc' },
        });

        let nextCursor: typeof cursor | undefined = undefined;

        if (blogs.length > limit) {
          const nextBlog = blogs.pop();
          nextCursor = nextBlog!.id;
        }

        return {
          blogs,
          nextCursor,
        };
      } catch (error) {
        if (error instanceof TRPCError) {
          throw error;
        } else {
          throw new TRPCError({ code: 'NOT_FOUND', message: 'Blogs not found' });
        }
      }
    }),
  create: protectedProcedure
    .input(
      z.object({
        name: z.string(),
        content: z.string(),
        date: z.date(),
        headerImage: z.string().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      try {
        if (ctx.session.user.admin !== true)
          throw new TRPCError({ code: 'UNAUTHORIZED', message: 'User not authorized' });

        let imageLink: string | undefined;
        if (input.headerImage) {
          try {
            const imagePath = await uploadImage(input.headerImage, 'blog');
            imageLink = env.SUPABASE_PROJECT_URL + '/storage/v1/object/public/' + imagePath;
          } catch (_error) {
            throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR', message: 'Failed to upload image' });
          }
        }

        const blog = await ctx.db.blog.create({
          data: {
            name: input.name,
            content: input.content,
            date: input.date,
            headerImage: imageLink,
          },
        });

        return {
          id: blog.id,
        };
      } catch (error) {
        if (error instanceof TRPCError) {
          throw error;
        } else {
          throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR', message: 'Internal server error' });
        }
      }
    }),
  update: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        data: z.object({
          name: z.string(),
          content: z.string(),
          date: z.date(),
          headerImage: z.string().optional(),
        }),
      })
    )
    .mutation(async ({ ctx, input }) => {
      try {
        if (ctx.session.user.admin !== true)
          throw new TRPCError({ code: 'UNAUTHORIZED', message: 'User not authorized' });

        const blog = await ctx.db.blog.findUnique({
          where: {
            id: input.id,
          },
        });

        if (!blog) {
          throw new TRPCError({ code: 'NOT_FOUND', message: 'Blog not found' });
        }

        let imageLink: string | undefined;
        if (input.data.headerImage) {
          try {
            const imagePath = await uploadImage(input.data.headerImage, 'blog');
            imageLink = env.SUPABASE_PROJECT_URL + '/storage/v1/object/public/' + imagePath;
          } catch (_error) {
            throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR', message: 'Failed to upload image' });
          }
        }

        const data = input.data;

        await ctx.db.blog.update({
          where: {
            id: input.id,
          },
          data: {
            name: data.name,
            content: data.content,
            date: data.date,
            headerImage: imageLink ?? blog.headerImage,
          },
        });
      } catch (error) {
        if (error instanceof TRPCError) {
          throw error;
        } else {
          throw new TRPCError({ code: 'NOT_FOUND', message: 'Blog not found' });
        }
      }
    }),
  delete: protectedProcedure
    .input(
      z.object({
        id: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      try {
        if (ctx.session.user.admin !== true)
          throw new TRPCError({ code: 'UNAUTHORIZED', message: 'User not authorized' });

        const blog = await ctx.db.blog.findUnique({
          where: {
            id: input.id,
          },
        });

        if (!blog) {
          throw new TRPCError({ code: 'NOT_FOUND', message: 'Blog not found' });
        }

        await ctx.db.blog.delete({
          where: {
            id: input.id,
          },
        });
      } catch (error) {
        if (error instanceof TRPCError) {
          throw error;
        } else {
          throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR', message: 'Internal server error' });
        }
      }
    }),
});
