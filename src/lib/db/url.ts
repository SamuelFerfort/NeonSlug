import prisma from "@/src/lib/prisma";
import { nanoid } from "nanoid";
import { unstable_cache } from "next/cache";
import { redis } from "../rate-limiter";
import { Url } from "@prisma/client";
import { ExtendedUrl } from "../types";

const CACHE_TTL = 24 * 60 * 60; // 24 hours

export async function findUrl(shortCode: string): Promise<ExtendedUrl | null> {
  const cached = await redis.get<ExtendedUrl>(`url-${shortCode}`);

  if (cached) {
    console.log("CACHE HIT:", shortCode);
    await redis.expire(`url-${shortCode}`, CACHE_TTL);
    return cached;
  }
  console.log("CACHE MISS:", shortCode);
  const url = await prisma.url.findUnique({
    where: { shortCode },
    include: { analytics: { include: { deviceStats: true } } },
  });

  if (url) {
    // store in cache for future requests
    await redis.set(`url-${shortCode}`, url, {
      ex: CACHE_TTL,
    });
  }

  return url;
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

export async function invalidateUrlCache(shortCode: string) {
  await redis.del(`url-${shortCode}`);
}

export async function updateUrlCache(shortCode: string, url: Url) {
  const exists = await redis.exists(`url-${shortCode}`);
  if (exists) {
    await redis.set(`url-${shortCode}`, url, {
      ex: CACHE_TTL,
    });
  }
}

export async function deleteExpiredUrls() {
  await prisma.url.deleteMany({
    where: { expiresAt: { lt: new Date() } },
  });
}
