import { DeviceStats, Url } from "@prisma/client";
import { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface Session {
    user: DefaultSession["user"];
  }
}
export type UserMenuProps = {
  user: DefaultSession["user"];
};
export type SimpleUrlState = {
  shortUrl?: string;
  error?: string;
  url?: string;
} | null;

export type UrlState = {
  url?: string;
  shortUrl?: string;
  error?: string;
  customSlug?: string;
  password?: string;
  expiresIn?: "never" | "1d" | "7d" | "30d";
  success?: boolean;
};

export type URLDialogProps = {
  mode: "create" | "edit";
  url?: ExtendedUrl;
  trigger?: React.ReactNode;
};

export type ExtendedUrl = Url & {
  analytics: {
    deviceStats: DeviceStats | null;
    id: string;
    urlId: string;
    totalClicks: number;
    lastClicked: Date;
    last7Days: number;
  } | null;
};

export type DeviceType = "desktop" | "tablet" | "mobile";

export type Params = Promise<{
  shortCode: string;
}>;

export type CountryStats = {
  code: string;
  count: number;
};

export type DashboardPageProps = {
  searchParams: { [key: string]: string | string[] | undefined };
};

export type URLsGridProps = {
  urls: ExtendedUrl[];
};

export type VerifyPasswordState = {
  password: string;
  shortCode: string;
  error?: string;
};

export type VerifyPasswordResult = {
  error?: string;
  success?: boolean;
};
