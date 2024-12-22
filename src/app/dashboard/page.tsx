import { auth } from "@/src/auth";
import { redirect } from "next/navigation";
import type { ExtendedUrl } from "@/src/lib/types";
import FilteredURLs from "./_components/filtered-urls";
import { getCachedUrls } from "@/src/lib/db/url";

export default async function DashboardPage() {
  const session = await auth();

  if (!session?.user?.id) {
    console.log("Missing user ID:", session); // For debugging
    redirect("/login");
  }

  const urls = (await getCachedUrls(session.user.id)) as ExtendedUrl[];

  return <FilteredURLs initialUrls={urls} />;
}
