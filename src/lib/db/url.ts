import prisma from "@/src/lib/prisma";
import { nanoid } from "nanoid";
import { unstable_cache } from "next/cache";

export async function findUrl(shortCode: string) {
  return prisma.url.findUnique({
    where: { shortCode },
    include: { analytics: { include: { deviceStats: true } } },
  });
}

export async function createSimpleUrl(url: string, userId: string | undefined) {
  return prisma.url.create({
    data: {
      originalUrl: url,
      shortCode: nanoid(6),
      userId,
    },
  });
}

export async function getCachedUrls(userId: string) {
  const getCached = unstable_cache(
    async () => {
      return prisma.url.findMany({
        where: {
          userId,
        },
        include: {
          analytics: {
            include: { deviceStats: true },
          },
        },
        orderBy: { createdAt: "asc" },
      });
    },
    [`urls-${userId}`],
    {
      revalidate: false,
      tags: [`user-${userId}-urls`], // Tag for revalidation
    },
  );

  return getCached();
}
