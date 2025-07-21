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

    // 1. Block IP addresses (common for malicious servers)
    if (/^\d+\.\d+\.\d+\.\d+$/.test(domain)) {
      return false;
    }

    // Block IPv6 addresses
    if (/^\[?[0-9a-f:]+\]?$/.test(domain)) {
      return false;
    }

    // 2. Block URL shorteners (prevent double-shortening)
    const shortenerPatterns = [
      /bit\.ly/i,
      /tinyurl\.com/i,
      /goo\.gl/i,
      /t\.co/i,
      /short\.link/i,
      /ow\.ly/i,
      /buff\.ly/i,
      /cutt\.ly/i,
      /rebrand\.ly/i,
      /is\.gd/i,
      /v\.gd/i,
      /tiny\.cc/i,
      /adf\.ly/i,
      /short\.io/i,
      /trib\.al/i,
      /lnkd\.in/i,
    ];

    // 3. Block suspicious job/opportunity sites
    const jobScamPatterns = [
      /jobopp\.com/i,
      /job.*opp/i, // jobopportunity, etc.
      /work.*home/i, // workhome, workfromhome variations
      /easy.*money/i,
      /quick.*cash/i,
      /earn.*online/i,
    ];

    // 4. Block suspicious file extensions in URLs
    const suspiciousExtensions = [
      /\.(exe|bat|cmd|scr|pif|com|jar)(\?|$)/i, // Executable files
      /\.(vbs|js|jse|wsf|wsh)(\?|$)/i, // Script files
    ];

    // 5. Block suspicious domains patterns
    const suspiciousDomainPatterns = [
      /[a-z]{20,}/, // Very long random strings
      /.*-.*-.*-.*\.com/, // Multiple hyphens (common in phishing)
      /.*\.(tk|ml|ga|cf|click|download)$/, // Free suspicious TLD
    ];

    // 6. Block suspicious path patterns
    const suspiciousPathPatterns = [
      /\/main\.cgi/i, // CGI scripts (like jobopp example)
      /\/admin/i, // Admin panels
      /\/wp-admin/i, // WordPress admin
      /\/phpmyadmin/i, // Database admin
    ];

    // 7. Block suspicious query parameters
    const suspiciousQueryPatterns = [
      /[?&]redirect=/i, // Redirect parameters
      /[?&]url=/i, // URL parameters
      /[?&]goto=/i, // Goto parameters
      /[?&][a-z]{2}\d{4,}/i, // Random params like dk5520
    ];

    // 8. Block obvious phishing patterns
    const phishingPatterns = [
      /paypal.*[0-9]+/i,
      /amazon.*[0-9]+/i,
      /google.*[0-9]+/i,
      /microsoft.*[0-9]+/i,
      /apple.*[0-9]+/i,
      /facebook.*[0-9]+/i,
      /bank.*[0-9]+/i,
      /secure.*[0-9]+/i,
    ];

    // Check all patterns
    const allPatterns = [
      ...shortenerPatterns,
      ...jobScamPatterns,
      ...suspiciousExtensions,
      ...suspiciousDomainPatterns,
      ...suspiciousPathPatterns,
      ...suspiciousQueryPatterns,
      ...phishingPatterns,
    ];

    // Return false if any suspicious pattern matches
    for (const pattern of allPatterns) {
      if (pattern.test(fullUrl) || pattern.test(domain) || pattern.test(path)) {
        return false;
      }
    }

    // Additional checks

    // Block URLs with too many subdomains (phishing technique)
    const subdomains = domain.split(".");
    if (subdomains.length > 4) {
      return false;
    }

    // Block URLs that are suspiciously long
    if (url.length > 2048) {
      return false;
    }

    // Block domains that are too short (likely suspicious)
    if (domain.length < 4) {
      return false;
    }

    // Block domains without proper TLD structure
    const parts = domain.split(".");
    if (parts.length < 2) {
      return false;
    }

    // Block domains with suspicious patterns
    if (
      domain.includes("--") ||
      domain.startsWith("-") ||
      domain.endsWith("-")
    ) {
      return false;
    }

    // Block data URLs and javascript URLs
    if (url.startsWith("data:") || url.startsWith("javascript:")) {
      return false;
    }

    return true;
  } catch {
    return false;
  }
}
