import { createTRPCRouter, publicProcedure } from '../trpc';

export const exhibitionsRouter = createTRPCRouter({
  getAll: publicProcedure.query(({ ctx }) => {
    return ctx.db.exhibition.findMany({ orderBy: { start: 'desc' } });
  }),
});
