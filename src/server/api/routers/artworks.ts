import { z } from 'zod';
import { createTRPCRouter, protectedProcedure, publicProcedure } from '@/server/api/trpc';
import { TRPCError } from '@trpc/server';
import uploadImage from '@/utils/uploadImage';
import { env } from '@/env';

export const artworksRouter = createTRPCRouter({
  getUnique: publicProcedure
    .input(
      z.object({
        id: z.string(),
      })
    )
    .query(async ({ ctx, input }) => {
      try {
        return ctx.db.artwork.findUnique({
          where: {
            id: input.id,
          },
          include: {
            artist: true,
          },
        });
      } catch (error) {
        if (error instanceof TRPCError) {
          throw error;
        } else {
          throw new TRPCError({ code: 'NOT_FOUND', message: 'Artwork not found' });
        }
      }
    }),
  getAll: publicProcedure
    .input(
      z.object({
        limit: z.number().min(1).max(100).nullish(),
        cursor: z.string().nullish(),
      })
    )
    .query(async ({ ctx, input }) => {
      try {
        const limit = input.limit ?? 10;
        const { cursor } = input;
        const artworks = await ctx.db.artwork.findMany({
          take: limit + 1,
          cursor: cursor ? { id: cursor } : undefined,
          include: {
            artist: true,
          },
        });

        let nextCursor: typeof cursor | undefined = undefined;

        if (artworks.length > limit) {
          const nextArtwork = artworks.pop();
          nextCursor = nextArtwork!.id;
        }

        return {
          artworks,
          nextCursor,
        };
      } catch (error) {
        if (error instanceof TRPCError) {
          throw error;
        } else {
          throw new TRPCError({ code: 'NOT_FOUND', message: 'Artworks not found' });
        }
      }
    }),
  getStyles: publicProcedure.query(async ({ ctx }) => {
    try {
      const styles = await ctx.db.artwork.groupBy({
        by: ['style'],
        _count: {
          style: true,
        },
      });

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
  getByStyle: publicProcedure
    .input(
      z.object({
        style: z.string(),
      })
    )
    .query(({ ctx, input }) => {
      try {
        return ctx.db.artwork.findMany({
          where: {
            style: {
              equals: input.style,
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
  getByArtist: publicProcedure
    .input(
      z.object({
        artistId: z.string(),
      })
    )
    .query(({ ctx, input }) => {
      try {
        return ctx.db.artwork.findMany({
          where: {
            artistId: input.artistId,
          },
          include: {
            artist: true,
          },
        });
      } catch (error) {
        if (error instanceof TRPCError) {
          throw error;
        } else {
          throw new TRPCError({ code: 'NOT_FOUND', message: 'Artworks by artist not found' });
        }
      }
    }),
  search: publicProcedure
    .input(
      z.object({
        term: z.string(),
      })
    )
    .query(({ ctx, input }) => {
      try {
        return ctx.db.artwork.findMany({
          where: {
            OR: [
              {
                name: {
                  contains: input.term,
                  mode: 'insensitive',
                },
              },
              {
                artist: {
                  name: {
                    contains: input.term,
                    mode: 'insensitive',
                  },
                },
              },
            ],
          },
          include: {
            artist: true,
          },
        });
      } catch (error) {
        if (error instanceof TRPCError) {
          throw error;
        } else {
          throw new TRPCError({ code: 'NOT_FOUND', message: 'Search failed' });
        }
      }
    }),
  create: protectedProcedure
    .input(
      z.object({
        name: z.string(),
        medium: z.string(),
        style: z.string(),
        date: z.string(),
        origin: z.string(),
        image: z.string().optional(),
        artistId: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      try {
        if (ctx.session.user.admin !== true)
          throw new TRPCError({ code: 'UNAUTHORIZED', message: 'User not authorized' });

        let imageLink: string | undefined;
        if (input.image) {
          try {
            const imagePath = await uploadImage(input.image);
            imageLink = env.SUPABASE_PROJECT_URL + '/storage/v1/object/public/' + imagePath;
          } catch (_error) {
            throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR', message: 'Failed to upload image' });
          }
        }

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

        return {
          id: artwork.id,
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
          medium: z.string(),
          style: z.string(),
          date: z.string(),
          origin: z.string(),
          image: z.string().optional(),
          artistId: z.string().optional(),
        }),
      })
    )
    .mutation(async ({ ctx, input }) => {
      try {
        if (ctx.session.user.admin !== true)
          throw new TRPCError({ code: 'UNAUTHORIZED', message: 'User not authorized' });

        const artwork = await ctx.db.artwork.findUnique({
          where: {
            id: input.id,
          },
        });

        if (!artwork) {
          throw new TRPCError({ code: 'NOT_FOUND', message: 'Artwork not found' });
        }

        let imageLink: string | undefined;
        if (input.data.image) {
          try {
            const imagePath = await uploadImage(input.data.image);
            imageLink = env.SUPABASE_PROJECT_URL + '/storage/v1/object/public/' + imagePath;
          } catch (_error) {
            throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR', message: 'Failed to upload image' });
          }
        }

        const data = input.data;

        await ctx.db.artwork.update({
          where: {
            id: input.id,
          },
          data: {
            name: data.name,
            medium: data.medium,
            style: data.style,
            date: data.date,
            origin: data.origin,
            image: imageLink ?? artwork.image,
            artistId: data.artistId ?? artwork.artistId,
          },
        });
      } catch (error) {
        if (error instanceof TRPCError) {
          throw error;
        } else {
          throw new TRPCError({ code: 'NOT_FOUND', message: 'Artwork not found' });
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

        const artwork = await ctx.db.artwork.findUnique({
          where: {
            id: input.id,
          },
        });

        if (!artwork) {
          throw new TRPCError({ code: 'NOT_FOUND', message: 'Artwork not found' });
        }

        await ctx.db.artwork.delete({
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
