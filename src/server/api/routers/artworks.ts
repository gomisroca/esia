import { TRPCError } from '@trpc/server';
import { z } from 'zod';

import { adminProcedure, createTRPCRouter, publicProcedure } from '@/server/api/trpc';
import handlePrismaNotFound from '@/utils/handlePrismaError';
import { resolveImageLink } from '@/utils/uploadImage';

const artworkInput = z.object({
  name: z.string().min(1, 'Name is required'),
  medium: z.string().min(1, 'Medium is required'),
  style: z.string().min(1, 'Style is required'),
  date: z.string().min(1, 'Date is required'),
  origin: z.string().min(1, 'Origin is required'),
  image: z.string().optional(),
  artistId: z.cuid(),
});

export const artworksRouter = createTRPCRouter({
  getUnique: publicProcedure
    .input(z.object({ id: z.cuid(), artist: z.boolean().default(false) }))
    .query(async ({ ctx, input }) => {
      const artwork = await ctx.db.artwork.findUnique({
        where: { id: input.id },
        include: { artist: input.artist },
      });
      if (!artwork) throw new TRPCError({ code: 'NOT_FOUND', message: 'Artwork not found' });
      return artwork;
    }),

  getAll: publicProcedure
    .input(
      z.object({
        artist: z.boolean().default(false),
        cursor: z.cuid().optional(),
        limit: z.number().int().min(1).max(100).default(20),
      })
    )
    .query(async ({ ctx, input }) => {
      const items = await ctx.db.artwork.findMany({
        take: input.limit + 1,
        cursor: input.cursor ? { id: input.cursor } : undefined,
        include: { artist: input.artist },
        orderBy: { name: 'asc' },
      });
      const nextCursor = items.length > input.limit ? items.pop()!.id : undefined;
      return { items, nextCursor };
    }),

  create: adminProcedure.input(artworkInput).mutation(async ({ ctx, input }) => {
    const imageLink = await resolveImageLink(input.image);
    const artwork = await ctx.db.artwork.create({
      data: {
        name: input.name,
        medium: input.medium,
        style: input.style,
        date: input.date,
        origin: input.origin,
        image: imageLink,
        artistId: input.artistId,
      },
    });
    return { id: artwork.id };
  }),

  update: adminProcedure
    .input(
      z.object({
        id: z.cuid(),
        data: artworkInput.extend({ image: z.string().optional(), artistId: z.cuid().optional() }),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const existing = await ctx.db.artwork.findUnique({ where: { id: input.id } });
      if (!existing) throw new TRPCError({ code: 'NOT_FOUND', message: 'Artwork not found' });

      const imageLink = await resolveImageLink(input.data.image);

      await ctx.db.artwork
        .update({
          where: { id: input.id },
          data: {
            name: input.data.name,
            medium: input.data.medium,
            style: input.data.style,
            date: input.data.date,
            origin: input.data.origin,
            image: imageLink ?? existing.image,
            artistId: input.data.artistId ?? existing.artistId,
          },
        })
        .catch(handlePrismaNotFound('Artwork'));
    }),

  delete: adminProcedure.input(z.object({ id: z.cuid() })).mutation(async ({ ctx, input }) => {
    await ctx.db.artwork.delete({ where: { id: input.id } }).catch(handlePrismaNotFound('Artwork'));
  }),

  search: publicProcedure
    .input(
      z.object({
        term: z.string().min(2, 'Search term must be at least 2 characters'),
        limit: z.number().int().min(1).max(50).default(20),
      })
    )
    .query(({ ctx, input }) => {
      return ctx.db.artwork.findMany({
        take: input.limit,
        where: {
          OR: [
            { name: { contains: input.term, mode: 'insensitive' } },
            { style: { contains: input.term, mode: 'insensitive' } },
            { artist: { name: { contains: input.term, mode: 'insensitive' } } },
          ],
        },
        include: { artist: true },
        orderBy: { name: 'asc' },
      });
    }),
});
