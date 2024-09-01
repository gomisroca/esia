import { z } from 'zod';
import { createTRPCRouter, publicProcedure } from '@/server/api/trpc';

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
      return ctx.db.artist.findUnique({
        where: {
          id: input.artistId,
        },
      });
    }),
});
