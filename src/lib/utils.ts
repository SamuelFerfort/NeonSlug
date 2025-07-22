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
    const fullUrl = url.toLowerCase();
    const domain = parsed.hostname.toLowerCase();
    const path = parsed.pathname.toLowerCase();

    // 1. Block IP addresses (but allow localhost for development)
    if (/^\d+\.\d+\.\d+\.\d+$/.test(domain) && domain !== "127.0.0.1") {
      return false;
    }

    // 2. Whitelist legitimate domains first (before blocking patterns)
    const whitelistedDomains = [
      "github.com",
      "gitlab.com",
      "bitbucket.org",
      "stackoverflow.com",
      "stackexchange.com",
      "medium.com",
      "dev.to",
      "hashnode.com",
      "youtube.com",
      "youtu.be",
      "vimeo.com",
      "twitter.com",
      "x.com",
      "facebook.com",
      "instagram.com",
      "linkedin.com",
      "reddit.com",
      "discord.com",
      "google.com",
      "microsoft.com",
      "apple.com",
      "amazon.com",
      "ebay.com",
      "paypal.com",
      "wikipedia.org",
      "wikimedia.org",
      "news.ycombinator.com",
      "techcrunch.com",
      "netlify.app",
      "vercel.app",
      "herokuapp.com",
      "firebase.app",
      "github.io",
      "gitlab.io",
    ];

    // Allow whitelisted domains (including their subdomains)
    if (
      whitelistedDomains.some(
        (whiteDomain) =>
          domain === whiteDomain || domain.endsWith("." + whiteDomain)
      )
    ) {
      return true;
    }

    // 3. Block URL shorteners (prevent double-shortening)
    const shortenerDomains = [
      "bit.ly",
      "tinyurl.com",
      "t.co",
      "goo.gl",
      "short.link",
      "ow.ly",
      "buff.ly",
      "cutt.ly",
      "rebrand.ly",
      "is.gd",
      "v.gd",
      "tiny.cc",
      "adf.ly",
      "short.io",
      "trib.al",
      "lnkd.in",
      "t.me",
      "t.ly",
      "t.co",
    ];

    if (
      shortenerDomains.some(
        (shortener) => domain === shortener || domain.endsWith("." + shortener)
      )
    ) {
      return false;
    }

    // 4. Block specific known scam domains
    const scamDomains = [
      "jobopp.com",
      // Add specific known bad domains here
    ];

    if (
      scamDomains.some(
        (scamDomain) =>
          domain === scamDomain || domain.endsWith("." + scamDomain)
      )
    ) {
      return false;
    }

    // 5. Block suspicious file extensions in path
    const suspiciousExtensions = [
      ".exe",
      ".bat",
      ".cmd",
      ".scr",
      ".pif",
      ".com",
      ".vbs",
      ".jar",
    ];
    if (suspiciousExtensions.some((ext) => path.endsWith(ext))) {
      return false;
    }

    // 6. Block suspicious TLDs (but be more conservative)
    const suspiciousTlds = [".tk", ".ml", ".ga", ".cf"];
    if (suspiciousTlds.some((tld) => domain.endsWith(tld))) {
      return false;
    }

    // 7. Block CGI scripts (like your jobopp example)
    if (/\/main\.cgi/i.test(path)) {
      return false;
    }

    // 8. Block obvious phishing patterns (but more specific)
    const phishingPatterns = [
      /paypal-?[0-9]+/i, // paypal123, paypal-123
      /amazon-?[0-9]+/i, // amazon123, amazon-123
      /google-?[0-9]+/i, // google123, google-123
      /microsoft-?[0-9]+/i, // microsoft123
      /apple-?[0-9]+/i, // apple123
      /facebook-?[0-9]+/i, // facebook123
      /secure-?[0-9]+/i, // secure123
    ];

    if (phishingPatterns.some((pattern) => pattern.test(domain))) {
      return false;
    }

    // 9. Block domains that are suspiciously long random strings
    // But allow legitimate long domains like legitimate business names
    if (/^[a-z0-9]{25,}\.com$/i.test(domain)) {
      return false;
    }

    // 10. Block data URLs and javascript URLs
    if (url.startsWith("data:") || url.startsWith("javascript:")) {
      return false;
    }

    // 11. Block domains with only numbers or very suspicious patterns
    if (/^[0-9-]+\.com$/i.test(domain)) {
      return false;
    }

    return true;
  } catch {
    return false;
  }
}
