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