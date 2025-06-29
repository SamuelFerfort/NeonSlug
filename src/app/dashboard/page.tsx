import { auth } from "@/src/auth";
import { redirect } from "next/navigation";
import FilteredURLs from "./_components/filtered-urls";
import { getCachedUrls } from "@/src/lib/db/url";
import { PollingDashboard } from "./_components/PollingDashboard";

export default async function DashboardPage() {
  const session = await auth();

  if (!session?.user?.id) {
    redirect("/login");
  }

  const urls = await getCachedUrls(session.user.id);

  return (
    <PollingDashboard>
      <FilteredURLs initialUrls={urls} />
    </PollingDashboard>
  );
}
