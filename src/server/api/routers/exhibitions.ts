import { z } from 'zod';
import { createTRPCRouter, publicProcedure } from '../trpc';
import { TRPCError } from '@trpc/server';

export const exhibitionsRouter = createTRPCRouter({
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
        const exhibitions = await ctx.db.exhibition.findMany({
          take: limit + 1,
          cursor: cursor ? { id: cursor } : undefined,
          orderBy: { start: 'desc' },
        });

        let nextCursor: typeof cursor | undefined = undefined;

        if (exhibitions.length > limit) {
          const nextExhibition = exhibitions.pop();
          nextCursor = nextExhibition!.id;
        }

        return {
          exhibitions,
          nextCursor,
        };
      } catch (error) {
        if (error instanceof TRPCError) {
          throw error;
        } else {
          throw new TRPCError({ code: 'NOT_FOUND', message: 'Exhibitions not found' });
        }
      }
    }),
  getUnique: publicProcedure.input(z.string()).query(({ ctx, input }) => {
    try {
      return ctx.db.exhibition.findUnique({ where: { id: input } });
    } catch (error) {
      if (error instanceof TRPCError) {
        throw error;
      } else {
        throw new TRPCError({ code: 'NOT_FOUND', message: 'Exhibition not found' });
      }
    }
  }),
});
