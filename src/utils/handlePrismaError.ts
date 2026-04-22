import { Prisma } from '@prisma/client';
import { TRPCError } from '@trpc/server';

export default function handlePrismaNotFound(entity: string) {
  return (error: unknown) => {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2025') {
      throw new TRPCError({ code: 'NOT_FOUND', message: `${entity} not found` });
    }
    throw error;
  };
}
