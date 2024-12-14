import { redirect } from 'next/navigation';
import prisma from '@/src/lib/prisma';
import { headers } from 'next/headers';
import type { ShortUrlPageProps } from '@/src/lib/types';


export default async function ShortUrlPage({ params }: ShortUrlPageProps) {
  const url = await prisma.url.findUnique({
    where: { shortCode: params.shortCode },
    include: { analytics: true }
  });

  if (!url || !url.isActive) {
    redirect('/404'); // Make sure you have a 404 page
  }

  // Get current date in YYYY-MM-DD format
  const today = new Date().toISOString().split('T')[0];
  
  const headersList = headers();
  const userAgent = headersList.get('user-agent')?.toString() || '';
  const deviceType = getDeviceType(userAgent);

  // Update analytics
  await prisma.analytics.update({
    where: { urlId: url.id },
    data: {
      totalClicks: { increment: 1 },
      lastUpdated: new Date(),
      // Update device stats
      devices: {
        set: {
          ...url.analytics?.devices as object,
          [deviceType]: ((url.analytics?.devices as any)?.[deviceType] || 0) + 1
        }
      },
      last30Days: {
        set: {
          ...url.analytics?.last30Days as object,
          [today]: ((url.analytics?.last30Days as any)?.[today] || 0) + 1
        }
      }
    }
  });

  // Also update the URL's clickCount and lastClickedAt
  await prisma.url.update({
    where: { id: url.id },
    data: {
      clickCount: { increment: 1 },
      lastClickedAt: new Date()
    }
  });

  redirect(url.originalUrl);
}

