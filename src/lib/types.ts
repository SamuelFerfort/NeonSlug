

export type UrlState = {
  shortUrl?: string;
  error?: string;
  url?: string;
} | null;


export type DeviceType = 'desktop' | 'tablet' | 'mobile';


export type ShortUrlPageProps  ={
  params: {
    shortCode: string;
  };
}