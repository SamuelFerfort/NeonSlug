import { Analytics, DeviceStats, Url } from "@prisma/client";

export type UrlState = {
  shortUrl?: string;
  error?: string;
  url?: string;
} | null;

export type DeviceType = "desktop" | "tablet" | "mobile";

export type Params = Promise<{
  shortCode: string;
}>;


export type CountryStats = {
  code: string;
  count: number;
};


export type UserMenuProps ={
  user: {
    name?: string | null;
    image?: string | null;
  };
}


// Type for URL with included analytics
export type URLWithAnalytics = Url & {
  analytics: (Analytics & {
    deviceStats: DeviceStats | null;
  }) | null;
};

export type DashboardPageProps = {
  searchParams: { [key: string]: string | string[] | undefined };
};

export type URLsGridProps = {
  urls: URLWithAnalytics[];
};