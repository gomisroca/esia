import { z } from 'zod';
import { createTRPCRouter, publicProcedure } from '@/server/api/trpc';

export const usersRouter = createTRPCRouter({
  getInformation: publicProcedure
    .input(
      z.object({
        userId: z.string(),
      })
    )
    .query(({ ctx, input }) => {
      return ctx.db.user.findUnique({
        where: {
          id: input.userId,
        },
        include: {
          favoriteArtworks: {
            include: {
              artwork: {
                include: {
                  artist: true,
                },
              },
            },
          },
        },
      });
    }),
  addFavoriteArtwork: publicProcedure
    .input(
      z.object({
        userId: z.string(),
        artworkId: z.string(),
      })
    )
    .mutation(({ ctx, input }) => {
      return ctx.db.user.update({
        where: {
          id: input.userId,
        },
        data: {
          favoriteArtworks: {
            connect: { id: input.artworkId },
          },
        },
      });
    }),
  removeFavoriteArtwork: publicProcedure
    .input(
      z.object({
        userId: z.string(),
        artworkId: z.string(),
      })
    )
    .mutation(({ ctx, input }) => {
      return ctx.db.user.update({
        where: {
          id: input.userId,
        },
        data: {
          favoriteArtworks: {
            disconnect: { id: input.artworkId },
          },
        },
      });
    }),
});
