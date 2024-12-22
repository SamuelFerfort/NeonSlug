'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export function PollingDashboard({ children }: { children: React.ReactNode }) {
  const router = useRouter();

  useEffect(() => {
    // Refresh data every 10 seconds
    const interval = setInterval(() => {
      router.refresh();
    }, 10000);

    return () => clearInterval(interval);
  }, [router]);

  return children;
}