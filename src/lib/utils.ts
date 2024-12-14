import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import type { DeviceType } from "./types";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getDeviceType(userAgent: string): DeviceType {
  const ua = userAgent.toLowerCase();
  if (/(tablet|ipad|playbook|silk)|(android(?!.*mobile))/i.test(ua)) {
    return "tablet";
  } else if (/mobile|android|ip(hone|od)|samsung|nokia/i.test(ua)) {
    return "mobile";
  }
  return "desktop";
}
