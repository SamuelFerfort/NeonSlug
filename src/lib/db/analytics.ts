import prisma from "../prisma";
import { DeviceType } from "../types";

export async function updateAnalytics(urlId: string, deviceType: DeviceType) {
  return prisma.analytics.upsert({
    where: { urlId },
    create: {
      urlId,
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
