import { z } from 'zod';
import { createTRPCRouter, publicProcedure } from '@/server/api/trpc';

export const artworksRouter = createTRPCRouter({
  getAll: publicProcedure.query(({ ctx }) => {
    return ctx.db.artwork.findMany({
      include: {
        artist: true,
      },
    });
  }),
  getStyles: publicProcedure.query(async ({ ctx }) => {
    const styles = await ctx.db.artwork.groupBy({
      by: ['style'],
      _count: {
        style: true,
      },
    });

    return styles
      .filter((styleGroup) => styleGroup.style !== null)
      .map((styleGroup) => ({
        name: styleGroup.style,
        count: styleGroup._count.style,
      }));
  }),
  getByStyle: publicProcedure
    .input(
      z.object({
        style: z.string(),
      })
    )
    .query(({ ctx, input }) => {
      return ctx.db.artwork.findMany({
        where: {
          style: input.style,
        },
        include: {
          artist: true,
        },
      });
    }),
  getByArtist: publicProcedure
    .input(
      z.object({
        artistId: z.string(),
      })
    )
    .query(({ ctx, input }) => {
      return ctx.db.artwork.findMany({
        where: {
          artistId: input.artistId,
        },
        include: {
          artist: true,
        },
      });
    }),
});
