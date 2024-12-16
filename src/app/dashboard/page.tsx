import { auth } from "@/src/auth";
import { redirect } from "next/navigation";
import URLShortener from "@/src/components/layout/url-shortener";
import URLsGrid from "./url-grid";
import prisma from "@/src/lib/prisma";
import type { URLWithAnalytics } from "@/src/lib/types";

export default async function DashboardPage() {
  const session = await auth();

  if (!session) {
    redirect("/auth/signin");
  }

  const urls = (await prisma.url.findMany({
    where: {
      userId: session.user?.id,
    },
    include: {
      analytics: {
        include: { deviceStats: true },
      },
    },
  })) as URLWithAnalytics[];

  return (
    <div className="min-h-screen  text-gray-100  flex flex-col pt-28">
      <URLShortener />
      <URLsGrid urls={urls} />
    </div>
  );
}
