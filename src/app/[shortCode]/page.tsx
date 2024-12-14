import { redirect, notFound } from "next/navigation";
import prisma from "@/src/lib/prisma";
import { headers } from "next/headers";
import type { Params } from "@/src/lib/types";
import { getDeviceType } from "@/src/lib/utils";

export default async function ShortUrlPage({ params }: { params: Params }) {
  const { shortCode } = await params;
  const url = await prisma.url.findUnique({
    where: { shortCode },
    include: { analytics: true },
  });

  if (!url || !url.isActive) {
    notFound();
  }

  const today = new Date().toISOString().split("T")[0];
  const userAgent = (await headers()).get("user-agent") ?? "";
  const deviceType = getDeviceType(userAgent);

  // Casting the JSON fields to our defined types
  const currentDevices =
    (url.analytics?.devices as PrismaJson.DeviceStats) ?? {};
  const currentLast30Days =
    (url.analytics?.last30Days as PrismaJson.DailyStats) ?? {};

  await prisma.analytics.update({
    where: { urlId: url.id },
    data: {
      totalClicks: { increment: 1 },
      lastUpdated: new Date(),
      devices: {
        set: {
          ...currentDevices,
          [deviceType]: (currentDevices[deviceType] ?? 0) + 1,
        },
      },
      last30Days: {
        set: {
          ...currentLast30Days,
          [today]: (currentLast30Days[today] ?? 0) + 1,
        },
      },
    },
  });

  await prisma.url.update({
    where: { id: url.id },
    data: {
      clickCount: { increment: 1 },
      lastClickedAt: new Date(),
    },
  });

  redirect(url.originalUrl);
}
