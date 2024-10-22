import { z } from 'zod';
import { createTRPCRouter, publicProcedure } from '@/server/api/trpc';
import { TRPCError } from '@trpc/server';

export const artworksRouter = createTRPCRouter({
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
        const artworks = await ctx.db.artwork.findMany({
          take: limit + 1,
          cursor: cursor ? { id: cursor } : undefined,
          include: {
            artist: true,
          },
        });

        let nextCursor: typeof cursor | undefined = undefined;

        if (artworks.length > limit) {
          const nextArtwork = artworks.pop();
          nextCursor = nextArtwork!.id;
        }

        return {
          artworks,
          nextCursor,
        };
      } catch (error) {
        if (error instanceof TRPCError) {
          throw error;
        } else {
          throw new TRPCError({ code: 'NOT_FOUND', message: 'Artworks not found' });
        }
      }
    }),
  getStyles: publicProcedure.query(async ({ ctx }) => {
    try {
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
    } catch (error) {
      if (error instanceof TRPCError) {
        throw error;
      } else {
        throw new TRPCError({ code: 'NOT_FOUND', message: 'Styles not found' });
      }
    }
  }),
  getByStyle: publicProcedure
    .input(
      z.object({
        style: z.string(),
      })
    )
    .query(({ ctx, input }) => {
      try {
        return ctx.db.artwork.findMany({
          where: {
            style: {
              equals: input.style,
              mode: 'insensitive',
            },
          },
          include: {
            artist: true,
          },
        });
      } catch (error) {
        if (error instanceof TRPCError) {
          throw error;
        } else {
          throw new TRPCError({ code: 'NOT_FOUND', message: 'Artworks by style not found' });
        }
      }
    }),
  getByArtist: publicProcedure
    .input(
      z.object({
        artistId: z.string(),
      })
    )
    .query(({ ctx, input }) => {
      try {
        return ctx.db.artwork.findMany({
          where: {
            artistId: input.artistId,
          },
          include: {
            artist: true,
          },
        });
      } catch (error) {
        if (error instanceof TRPCError) {
          throw error;
        } else {
          throw new TRPCError({ code: 'NOT_FOUND', message: 'Artworks by artist not found' });
        }
      }
    }),
  search: publicProcedure
    .input(
      z.object({
        term: z.string(),
      })
    )
    .query(({ ctx, input }) => {
      try {
        return ctx.db.artwork.findMany({
          where: {
            OR: [
              {
                name: {
                  contains: input.term,
                  mode: 'insensitive',
                },
              },
              {
                artist: {
                  name: {
                    contains: input.term,
                    mode: 'insensitive',
                  },
                },
              },
            ],
          },
          include: {
            artist: true,
          },
        });
      } catch (error) {
        if (error instanceof TRPCError) {
          throw error;
        } else {
          throw new TRPCError({ code: 'NOT_FOUND', message: 'Search failed' });
        }
      }
    }),
});
