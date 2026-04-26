import { TRPCError } from '@trpc/server';
import { z } from 'zod';

import { adminProcedure, createTRPCRouter, publicProcedure } from '@/server/api/trpc';
import handlePrismaNotFound from '@/utils/handlePrismaError';

const artistInput = z.object({
  name: z.string().min(1, 'Name is required'),
  description: z.string().min(1, 'Description is required'),
  birth: z.number().int().positive(),
  death: z.number().int().positive().optional(),
});

export const artistsRouter = createTRPCRouter({
  getUnique: publicProcedure
    .input(z.object({ id: z.cuid(), artworks: z.boolean().default(false) }))
    .query(async ({ ctx, input }) => {
      const artist = await ctx.db.artist.findUnique({
        where: { id: input.id },
        include: { artworks: input.artworks },
      });
      if (!artist) throw new TRPCError({ code: 'NOT_FOUND', message: 'Artist not found' });
      return artist;
    }),

  getAll: publicProcedure
    .input(
      z.object({
        artworks: z.boolean().default(false),
        cursor: z.cuid().optional(),
        limit: z.number().int().min(1).max(100).default(20),
      })
    )
    .query(async ({ ctx, input }) => {
      const items = await ctx.db.artist.findMany({
        take: input.limit + 1,
        cursor: input.cursor ? { id: input.cursor } : undefined,
        include: { artworks: input.artworks },
        orderBy: { name: 'asc' },
      });
      const nextCursor = items.length > input.limit ? items.pop()!.id : undefined;
      return { items, nextCursor };
    }),

  create: adminProcedure.input(artistInput).mutation(async ({ ctx, input }) => {
    const artist = await ctx.db.artist.create({
      data: {
        name: input.name,
        description: input.description,
        birth: input.birth,
        death: input.death === 0 ? undefined : input.death,
      },
    });
    return { id: artist.id };
  }),

  update: adminProcedure.input(z.object({ id: z.cuid(), data: artistInput })).mutation(async ({ ctx, input }) => {
    await ctx.db.artist
      .update({
        where: { id: input.id },
        data: {
          name: input.data.name,
          description: input.data.description,
          birth: input.data.birth,
          death: input.data.death === 0 ? undefined : input.data.death,
        },
      })
      .catch(handlePrismaNotFound('Artist'));
  }),

  delete: adminProcedure.input(z.object({ id: z.cuid() })).mutation(async ({ ctx, input }) => {
    await ctx.db.artist.delete({ where: { id: input.id } }).catch(handlePrismaNotFound('Artist'));
  }),
});
