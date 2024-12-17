import { auth } from "@/src/auth";
import { redirect } from "next/navigation";
import prisma from "@/src/lib/prisma";
import type { ExtendedUrl } from "@/src/lib/types";
import FilteredURLs from "./filtered-urls";

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
  })) as ExtendedUrl[];

  return <FilteredURLs initialUrls={urls} />;
}
