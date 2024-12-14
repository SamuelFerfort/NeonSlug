declare global {
  namespace PrismaJson {
    type DeviceStats = {
      desktop?: number;
      tablet?: number;
      mobile?: number;
    };
    type DailyStats = {
      [date: string]: number;
    };
  }
}

export {};
