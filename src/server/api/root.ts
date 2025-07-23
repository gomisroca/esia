import { createCallerFactory, createTRPCRouter } from '@/server/api/trpc';

import { artistsRouter } from './routers/artists';
import { artworksRouter } from './routers/artworks';
import { blogsRouter } from './routers/blogs';
import { exhibitionsRouter } from './routers/exhibitions';
import { stylesRouter } from './routers/styles';

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  artworks: artworksRouter,
  artists: artistsRouter,
  styles: stylesRouter,
  exhibitions: exhibitionsRouter,
  blogs: blogsRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;

/**
 * Create a server-side caller for the tRPC API.
 * @example
 * const trpc = createCaller(createContext);
 * const res = await trpc.post.all();
 *       ^? Post[]
 */
export const createCaller = createCallerFactory(appRouter);
