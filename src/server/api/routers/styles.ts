import { TRPCError } from '@trpc/server';
import { z } from 'zod';

import { createTRPCRouter, publicProcedure } from '@/server/api/trpc';

export const stylesRouter = createTRPCRouter({
  getUnique: publicProcedure
    .input(
      z.object({
        name: z.string(),
      })
    )
    .query(async ({ ctx, input }) => {
      try {
        return ctx.db.artwork.findMany({
          where: {
            style: {
              equals: input.name,
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
  getAll: publicProcedure
    .input(
      z.object({
        artworks: z.boolean().optional().default(false),
      })
    )
    .query(async ({ ctx, input }) => {
      try {
        const styles = await ctx.db.artwork.groupBy({
          by: ['style'],
          _count: {
            style: true,
          },
        });

        if (input.artworks) {
          const artworksByStyle = await ctx.db.artwork.findMany({
            where: {
              style: {
                not: null,
              },
            },
            select: {
              style: true,
              id: true,
              name: true,
              artist: true,
              image: true,
            },
          });
          const artworksGroupedByStyle = artworksByStyle.reduce(
            (acc, artwork) => {
              if (!acc[artwork.style!]) {
                acc[artwork.style!] = [];
              }
              acc[artwork.style!]!.push(artwork);
              return acc;
            },
            {} as Record<string, typeof artworksByStyle>
          );

          // Combine styles with their artworks
          return styles
            .filter((styleGroup) => styleGroup.style !== null)
            .map((styleGroup) => ({
              name: styleGroup.style,
              count: styleGroup._count.style,
              artworks: artworksGroupedByStyle[styleGroup.style!] ?? [],
            }));
        }

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
});
