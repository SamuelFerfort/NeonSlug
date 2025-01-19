import { MetadataRoute } from "next";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const currentDate = new Date().toISOString();

  return [
    {
      url: "https://neonslug.com",
      lastModified: currentDate,
      priority: 1,
    },
    {
      url: "https://neonslug.com/login",
      lastModified: currentDate,
      priority: 0.5,
    },
  ];
}
