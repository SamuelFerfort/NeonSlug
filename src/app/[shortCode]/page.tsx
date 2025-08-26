import { redirect, notFound } from "next/navigation";
import { headers } from "next/headers";
import { getDeviceType } from "@/src/lib/utils";
import { updateAnalytics } from "@/src/lib/db/analytics";
import { deleteExpiredUrls, findUrl } from "@/src/lib/db/url";
import { revalidateTag } from "next/cache";
import { after } from "next/server";

export default async function ShortUrlPage({
  params,
}: {
  params: Promise<{ shortCode: string }>;
}) {
  const { shortCode } = await params;
  const headersList = await headers();

  const url = await findUrl(shortCode);
  const isExpired = url?.expiresAt && new Date() > url?.expiresAt;
  if (!url || !url.isActive || isExpired) {
    notFound();
  }

  // updating analytics if the url has a logged in user
  if (url.userId) {
    // after api to not block redirecting improving performance
    after(async () => {
      if (!isExpired) {
        const deviceType = getDeviceType(headersList.get("user-agent") ?? "");
        await updateAnalytics(url.id, deviceType).catch(console.error);
        revalidateTag(`user-${url.userId}-urls`);
      }

      await deleteExpiredUrls();
    });
  }

  if (url.password) {
    redirect(`/protected/${shortCode}`);
  }

  redirect(url.originalUrl);
}
