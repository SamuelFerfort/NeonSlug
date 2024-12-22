import { redirect, notFound } from "next/navigation";
import { headers } from "next/headers";
import type { Params } from "@/src/lib/types";
import { getDeviceType } from "@/src/lib/utils";
import { updateAnalytics } from "@/src/lib/db/analytics";
import { findUrl } from "@/src/lib/db/url";

export default async function ShortUrlPage({ params }: { params: Params }) {
  const { shortCode } = await params;
  const headersList = await headers();

  const url = await findUrl(shortCode);

  if (!url || !url.isActive || (url.expiresAt && new Date() > url.expiresAt)) {
    notFound();
  }

  // Only update analytics if the url has a logged in user
  if (url.userId) {
    const deviceType = getDeviceType(headersList.get("user-agent") ?? "");

    updateAnalytics(url.id, deviceType).catch(console.error);
  }


  if (url.password) {
    redirect(`/protected/${shortCode}`);
  }

  redirect(url.originalUrl);
}
