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

export function calculateExpiryDate(expiresIn: "1d" | "7d" | "30d"): Date {
  const days = parseInt(expiresIn);
  const date = new Date();
  date.setDate(date.getDate() + days);
  return date;
}

export const getExpirationValue = (expiresAt: Date | null) => {
  if (!expiresAt) return "never";

  const expirationDate = new Date(expiresAt);
  const now = new Date();

  const diff = expirationDate.getTime() - now.getTime();
  const daysRemaining = Math.ceil(diff / (1000 * 60 * 60 * 24));

  if (daysRemaining <= 1) return "1d";
  if (daysRemaining <= 7) return "7d";
  if (daysRemaining <= 30) return "30d";
  return "never";
};


export const truncateUrl = (url: string) => {
  return url.length > 90 ? url.substring(0, 90) + "..." : url;
};

export function isUrlPatternSafe(url: string): boolean {
  try {
    const parsed = new URL(url);
    const hostname = parsed.hostname.toLowerCase();
    
    // Block IP addresses (common for malicious servers)
    if (hostname.match(/^\d+\.\d+\.\d+\.\d+$/)) {
      return false;
    }
    
    // Block IPv6 addresses
    if (hostname.match(/^\[?[0-9a-f:]+\]?$/)) {
      return false;
    }
    
    // Block nested URL shorteners (used to hide destinations)
    const shortenerDomains = [
      'bit.ly', 'tinyurl.com', 't.co', 'goo.gl', 'ow.ly', 
      'is.gd', 'buff.ly', 'adf.ly', 'short.link', 'tiny.cc',
      't.me', 'kp2.enn.kr', 'cutt.ly', 'rebrand.ly', 'short.io',
      'trib.al', 'lnkd.in', 'youtu.be', 'amzn.to', 'on.fb.me',
      'instagr.am', 'snapchat.com/add', 'discord.gg', 'join.skype.com',
      'zoom.us/j', 'meet.google.com', 'teams.microsoft.com',
      'dl.dropboxusercontent.com', 'drive.google.com/file',
      '1drv.ms', 'icloud.com/iclouddrive', 'we.tl', 'send.firefox.com'
    ];
    if (shortenerDomains.some(domain => 
      hostname === domain || hostname.endsWith(`.${domain}`)
    )) {
      return false;
    }
    
    // Block suspicious TLDs (often used for malicious sites)
    const suspiciousTlds = ['.tk', '.ml', '.ga', '.cf', '.click', '.download'];
    if (suspiciousTlds.some(tld => hostname.endsWith(tld))) {
      return false;
    }
    
    // Block domains that are too short (likely suspicious)
    if (hostname.length < 4) {
      return false;
    }
    
    // Block domains without proper TLD structure
    const parts = hostname.split('.');
    if (parts.length < 2) {
      return false;
    }
    
    // Block domains with suspicious patterns
    if (hostname.includes('--') || hostname.startsWith('-') || hostname.endsWith('-')) {
      return false;
    }
    
    // Block obvious phishing patterns
    const phishingPatterns = [
      /paypal.*[0-9]+/,
      /amazon.*[0-9]+/,
      /google.*[0-9]+/,
      /microsoft.*[0-9]+/,
      /apple.*[0-9]+/,
      /facebook.*[0-9]+/,
      /instagram.*[0-9]+/,
      /twitter.*[0-9]+/,
      /bank.*[0-9]+/,
      /secure.*[0-9]+/
    ];
    
    if (phishingPatterns.some(pattern => pattern.test(hostname))) {
      return false;
    }
    
    // Block suspicious file extensions in path
    const suspiciousExtensions = ['.exe', '.scr', '.bat', '.cmd', '.com', '.pif', '.vbs', '.jar'];
    if (suspiciousExtensions.some(ext => parsed.pathname.toLowerCase().endsWith(ext))) {
      return false;
    }
    
    return true;
  } catch {
    // If URL parsing fails, it's invalid
    return false;
  }
}
