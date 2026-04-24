import { type Prisma } from '@prisma/client';
import { z } from 'zod/v4';

import { createTRPCRouter, publicProcedure } from '@/server/api/trpc';

type ArtworkWithArtist = Prisma.ArtworkGetPayload<{
  select: { id: true; name: true; style: true; image: true; artist: true };
}>;

export const stylesRouter = createTRPCRouter({
  getUnique: publicProcedure.input(z.object({ name: z.string().min(1) })).query(({ ctx, input }) => {
    return ctx.db.artwork.findMany({
      where: { style: { equals: input.name, mode: 'insensitive' } },
      include: { artist: true },
      orderBy: { name: 'asc' },
    });
  }),

  getAll: publicProcedure.input(z.object({ artworks: z.boolean().default(false) })).query(async ({ ctx, input }) => {
    const styles = await ctx.db.artwork.groupBy({
      by: ['style'],
      where: { style: { not: null } },
      _count: { style: true },
      orderBy: { style: 'asc' },
    });

    const validStyles = styles.filter((s): s is typeof s & { style: string } => s.style !== null);

    if (!input.artworks) {
      return validStyles.map((s) => ({
        name: s.style,
        count: s._count.style,
      }));
    }

    const artworksByStyle = await ctx.db.artwork.findMany({
      where: { style: { in: validStyles.map((s) => s.style), not: null } },
      select: { id: true, name: true, style: true, image: true, artist: true },
      orderBy: { name: 'asc' },
    });

    const grouped = artworksByStyle.reduce<Record<string, ArtworkWithArtist[]>>((acc, artwork) => {
      if (!artwork.style) return acc;
      (acc[artwork.style] ??= []).push(artwork);
      return acc;
    }, {});

    return validStyles.map((s) => ({
      name: s.style,
      count: s._count.style,
      artworks: grouped[s.style] ?? [],
    }));
  }),
});
