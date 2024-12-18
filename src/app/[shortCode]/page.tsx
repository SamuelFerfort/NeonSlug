import { redirect, notFound } from "next/navigation";
import prisma from "@/src/lib/prisma";
import { headers } from "next/headers";
import type { Params } from "@/src/lib/types";
import { getDeviceType } from "@/src/lib/utils";

export default async function ShortUrlPage({ params }: { params: Params }) {
  const { shortCode } = await params;
  const headersList = await headers();
  const url = await prisma.url.findUnique({
    where: { shortCode },
    include: { analytics: { include: { deviceStats: true } } },
  });

  if (!url || !url.isActive || (url.expiresAt && new Date() > url.expiresAt)) {
    notFound();
  }

  // Only update analytics if the url has a logged in user
  if (url.userId) {
    const deviceType = getDeviceType(headersList.get("user-agent") ?? "");

    await prisma.analytics.upsert({
      where: { urlId: url.id },
      create: {
        urlId: url.id,
        totalClicks: 1,
        deviceStats: {
          create: {
            [deviceType]: 1,
          },
        },
      },
      update: {
        totalClicks: { increment: 1 },
        deviceStats: {
          update: {
            [deviceType]: {
              increment: 1,
            },
          },
        },
      },
    });
  }

  // If URL is password protected, redirect to password page
  if (url.password) {
    redirect(`/protected/${shortCode}`);
  }

  redirect(url.originalUrl);
}
