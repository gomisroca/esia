import { TRPCError } from '@trpc/server';
import { z } from 'zod';

import { createTRPCRouter, protectedProcedure, publicProcedure } from '@/server/api/trpc';

export const artistsRouter = createTRPCRouter({
  getUnique: publicProcedure
    .input(
      z.object({
        id: z.string(),
        artworks: z.boolean().optional().default(false),
      })
    )
    .query(async ({ ctx, input }) => {
      try {
        return ctx.db.artist.findUnique({
          where: {
            id: input.id,
          },
          include: {
            artworks: input.artworks,
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
  getAll: publicProcedure
    .input(
      z.object({
        artworks: z.boolean().optional().default(false),
      })
    )
    .query(({ ctx, input }) => {
      try {
        return ctx.db.artist.findMany({
          include: {
            artworks: input.artworks,
          },
        });
      } catch (error) {
        if (error instanceof TRPCError) {
          throw error;
        } else {
          throw new TRPCError({ code: 'NOT_FOUND', message: 'Artists not found' });
        }
      }
    }),
  create: protectedProcedure
    .input(
      z.object({
        name: z.string(),
        description: z.string(),
        birth: z.number(),
        death: z.number().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      try {
        if (ctx.session.user.admin !== true)
          throw new TRPCError({ code: 'UNAUTHORIZED', message: 'User not authorized' });

        const artist = await ctx.db.artist.create({
          data: {
            name: input.name,
            description: input.description,
            birth: input.birth,
            death: input.death === 0 ? undefined : input.death,
          },
        });

        return {
          id: artist.id,
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
          description: z.string(),
          birth: z.number(),
          death: z.number().optional(),
        }),
      })
    )
    .mutation(async ({ ctx, input }) => {
      try {
        if (ctx.session.user.admin !== true)
          throw new TRPCError({ code: 'UNAUTHORIZED', message: 'User not authorized' });

        const artist = await ctx.db.artist.findUnique({
          where: {
            id: input.id,
          },
        });

        if (!artist) {
          throw new TRPCError({ code: 'NOT_FOUND', message: 'Artist not found' });
        }

        const data = input.data;

        await ctx.db.artist.update({
          where: {
            id: input.id,
          },
          data: {
            name: data.name,
            description: data.description,
            birth: data.birth,
            death: data.death === 0 ? undefined : data.death,
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

        const artist = await ctx.db.artist.findUnique({
          where: {
            id: input.id,
          },
        });

        if (!artist) {
          throw new TRPCError({ code: 'NOT_FOUND', message: 'Artist not found' });
        }

        await ctx.db.artist.delete({
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
