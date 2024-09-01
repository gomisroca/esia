import { z } from 'zod';
import { createTRPCRouter, publicProcedure } from '@/server/api/trpc';

const defaultPagination = {
  skip: 0,
  take: 10,
};

export const artworksRouter = createTRPCRouter({
  getAll: publicProcedure
    .input(
      z.object({
        skip: z.number().optional(),
        take: z.number().optional(),
      })
    )
    .query(({ ctx, input }) => {
      const { skip, take } = { ...defaultPagination, ...input };

      return ctx.db.artwork.findMany({
        skip,
        take,
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
        skip: z.number().optional(),
        take: z.number().optional(),
      })
    )
    .query(({ ctx, input }) => {
      const { skip, take } = { ...defaultPagination, ...input };

      return ctx.db.artwork.findMany({
        skip,
        take,
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
