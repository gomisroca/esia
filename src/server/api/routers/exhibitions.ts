import { TRPCError } from '@trpc/server';
import { z } from 'zod/v4';

import { adminProcedure, createTRPCRouter, publicProcedure } from '@/server/api/trpc';
import handlePrismaNotFound from '@/utils/handlePrismaError';
import { resolveImageLink } from '@/utils/uploadImage';

const exhibitionInput = z.object({
  name: z.string().min(1, 'Name is required'),
  description: z.string().min(1, 'Description is required'),
  image: z.string().optional(),
  start: z.date(),
  end: z.date(),
});

export const exhibitionsRouter = createTRPCRouter({
  getUnique: publicProcedure.input(z.object({ id: z.cuid() })).query(async ({ ctx, input }) => {
    const exhibition = await ctx.db.exhibition.findUnique({ where: { id: input.id } });
    if (!exhibition) throw new TRPCError({ code: 'NOT_FOUND', message: 'Exhibition not found' });
    return exhibition;
  }),

  getAll: publicProcedure.query(({ ctx }) => {
    return ctx.db.exhibition.findMany({ orderBy: { start: 'desc' } });
  }),

  create: adminProcedure.input(exhibitionInput).mutation(async ({ ctx, input }) => {
    const imageLink = await resolveImageLink(input.image, 'exhibition');
    const exhibition = await ctx.db.exhibition.create({
      data: {
        name: input.name,
        description: input.description,
        image: imageLink,
        start: input.start,
        end: input.end,
      },
    });
    return { id: exhibition.id };
  }),

  update: adminProcedure.input(z.object({ id: z.cuid(), data: exhibitionInput })).mutation(async ({ ctx, input }) => {
    const existing = await ctx.db.exhibition.findUnique({ where: { id: input.id } });
    if (!existing) throw new TRPCError({ code: 'NOT_FOUND', message: 'Exhibition not found' });

    const imageLink = await resolveImageLink(input.data.image, 'exhibition');

    await ctx.db.exhibition
      .update({
        where: { id: input.id },
        data: {
          name: input.data.name,
          description: input.data.description,
          image: imageLink ?? existing.image,
          start: input.data.start,
          end: input.data.end,
        },
      })
      .catch(handlePrismaNotFound('Exhibition'));
  }),

  delete: adminProcedure.input(z.object({ id: z.cuid() })).mutation(async ({ ctx, input }) => {
    await ctx.db.exhibition.delete({ where: { id: input.id } }).catch(handlePrismaNotFound('Exhibition'));
  }),
});
