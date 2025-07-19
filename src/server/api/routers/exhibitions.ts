import { TRPCError } from '@trpc/server';
import { z } from 'zod';

import { env } from '@/env';
import uploadImage from '@/utils/uploadImage';

import { createTRPCRouter, protectedProcedure, publicProcedure } from '../trpc';

export const exhibitionsRouter = createTRPCRouter({
  getUnique: publicProcedure
    .input(
      z.object({
        id: z.string(),
      })
    )
    .query(({ ctx, input }) => {
      try {
        return ctx.db.exhibition.findUnique({ where: { id: input.id } });
      } catch (error) {
        if (error instanceof TRPCError) {
          throw error;
        } else {
          throw new TRPCError({ code: 'NOT_FOUND', message: 'Exhibition not found' });
        }
      }
    }),
  getAll: publicProcedure.query(async ({ ctx }) => {
    try {
      const exhibitions = await ctx.db.exhibition.findMany({
        orderBy: { start: 'desc' },
      });

      return exhibitions;
    } catch (error) {
      if (error instanceof TRPCError) {
        throw error;
      } else {
        throw new TRPCError({ code: 'NOT_FOUND', message: 'Exhibitions not found' });
      }
    }
  }),
  create: protectedProcedure
    .input(
      z.object({
        name: z.string(),
        image: z.string().optional(),
        description: z.string(),
        start: z.date(),
        end: z.date(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      try {
        if (ctx.session.user.admin !== true)
          throw new TRPCError({ code: 'UNAUTHORIZED', message: 'User not authorized' });

        let imageLink: string | undefined;
        if (input.image) {
          try {
            const imagePath = await uploadImage(input.image, 'exhibition');
            imageLink = env.SUPABASE_PROJECT_URL + '/storage/v1/object/public/' + imagePath;
          } catch (_error) {
            throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR', message: 'Failed to upload image' });
          }
        }

        const exhibition = await ctx.db.exhibition.create({
          data: {
            name: input.name,
            image: imageLink,
            description: input.description,
            start: input.start,
            end: input.end,
          },
        });

        return {
          id: exhibition.id,
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
          image: z.string().optional(),
          description: z.string(),
          start: z.date(),
          end: z.date(),
        }),
      })
    )
    .mutation(async ({ ctx, input }) => {
      try {
        if (ctx.session.user.admin !== true)
          throw new TRPCError({ code: 'UNAUTHORIZED', message: 'User not authorized' });

        const exhibition = await ctx.db.exhibition.findUnique({
          where: {
            id: input.id,
          },
        });

        if (!exhibition) {
          throw new TRPCError({ code: 'NOT_FOUND', message: 'Exhibition not found' });
        }

        let imageLink: string | undefined;
        if (input.data.image) {
          try {
            const imagePath = await uploadImage(input.data.image, 'exhibition');
            imageLink = env.SUPABASE_PROJECT_URL + '/storage/v1/object/public/' + imagePath;
          } catch (_error) {
            throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR', message: 'Failed to upload image' });
          }
        }

        const data = input.data;

        await ctx.db.exhibition.update({
          where: {
            id: input.id,
          },
          data: {
            name: data.name,
            image: imageLink ?? exhibition.image,
            description: data.description,
            start: data.start,
            end: data.end,
          },
        });
      } catch (error) {
        if (error instanceof TRPCError) {
          throw error;
        } else {
          throw new TRPCError({ code: 'NOT_FOUND', message: 'Exhibition not found' });
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

        const exhibition = await ctx.db.exhibition.findUnique({
          where: {
            id: input.id,
          },
        });

        if (!exhibition) {
          throw new TRPCError({ code: 'NOT_FOUND', message: 'Exhibition not found' });
        }

        await ctx.db.exhibition.delete({
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
