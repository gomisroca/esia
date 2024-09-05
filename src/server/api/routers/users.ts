import { z } from 'zod';
import { createTRPCRouter, protectedProcedure } from '@/server/api/trpc';

export const usersRouter = createTRPCRouter({
  getInformation: protectedProcedure.query(({ ctx }) => {
    return ctx.db.user.findUnique({
      where: {
        id: ctx.session.user.id,
      },
    });
  }),
  getFavoriteArtworks: protectedProcedure.query(({ ctx }) => {
    return ctx.db.userArtwork.findMany({
      where: {
        userId: ctx.session.user.id,
      },
      include: {
        artwork: {
          include: {
            artist: true,
          },
        },
      },
    });
  }),
  addFavoriteArtwork: protectedProcedure
    .input(
      z.object({
        artworkId: z.string(),
      })
    )
    .mutation(({ ctx, input }) => {
      return ctx.db.user.update({
        where: {
          id: ctx.session.user.id,
        },
        data: {
          favoriteArtworks: {
            connect: { id: input.artworkId },
          },
        },
      });
    }),
  removeFavoriteArtwork: protectedProcedure
    .input(
      z.object({
        artworkId: z.string(),
      })
    )
    .mutation(({ ctx, input }) => {
      return ctx.db.user.update({
        where: {
          id: ctx.session.user.id,
        },
        data: {
          favoriteArtworks: {
            disconnect: { id: input.artworkId },
          },
        },
      });
    }),
});
