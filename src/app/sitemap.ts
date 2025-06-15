import { MetadataRoute } from "next";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const currentDate = new Date().toISOString();

  return [
    {
      url: "https://neonslug.com",
      lastModified: currentDate,
      priority: 1,
    },
  ];
}
