import { z } from 'zod';
import { createTRPCRouter, publicProcedure } from '@/server/api/trpc';
import { TRPCError } from '@trpc/server';

export const artistsRouter = createTRPCRouter({
  getInformation: publicProcedure
    .input(
      z.object({
        artistId: z.string(),
        skip: z.number().optional(),
        take: z.number().optional(),
      })
    )
    .query(({ ctx, input }) => {
      try {
        return ctx.db.artist.findUnique({
          where: {
            id: input.artistId,
          },
        });
      } catch (error) {
        if (error instanceof TRPCError) {
          throw error;
        } else {
          throw new TRPCError({ code: 'NOT_FOUND', message: 'Artist not found' });
        }
      }
    }),
});
