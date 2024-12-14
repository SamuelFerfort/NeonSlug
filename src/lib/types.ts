

export type UrlState = {
  shortUrl?: string;
  error?: string;
  url?: string;
} | null;


export type DeviceType = 'desktop' | 'tablet' | 'mobile';


export type Params  =  Promise <{
    shortCode: string;
  }>



// Types for the JSON fields
export type DeviceStats = {
  desktop?: number;
  tablet?: number;
  mobile?: number;
};

export type DailyStats = {
  [date: string]: number;
};


export type AnalyticsData = {
  devices: PrismaJson.DeviceStats;
  last30Days: PrismaJson.DailyStats;
};