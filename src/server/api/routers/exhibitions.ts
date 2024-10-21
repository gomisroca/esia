import { z } from 'zod';
import { createTRPCRouter, publicProcedure } from '../trpc';
import { TRPCError } from '@trpc/server';

export const exhibitionsRouter = createTRPCRouter({
  getAll: publicProcedure.query(({ ctx }) => {
    try {
      return ctx.db.exhibition.findMany({ orderBy: { start: 'desc' } });
    } catch (error) {
      if (error instanceof TRPCError) {
        throw error;
      } else {
        throw new TRPCError({ code: 'NOT_FOUND', message: 'Exhibitions not found' });
      }
    }
  }),
  getUnique: publicProcedure.input(z.string()).query(({ ctx, input }) => {
    try {
      return ctx.db.exhibition.findUnique({ where: { id: input } });
    } catch (error) {
      if (error instanceof TRPCError) {
        throw error;
      } else {
        throw new TRPCError({ code: 'NOT_FOUND', message: 'Exhibition not found' });
      }
    }
  }),
});
