import prisma from "./prisma";

type SecurityEventType =
  | "MALICIOUS_URL_BLOCKED"
  | "RATE_LIMIT_EXCEEDED"
  | "SUSPICIOUS_ACTIVITY"
  | "INVALID_URL_PATTERN";

interface SecurityEventDetails {
  url?: string;
  userId?: string;
  ip?: string;
  userAgent?: string;
  shortCode?: string;
  reason?: string;
  metadata?: Record<string, unknown>;
}

export async function logSecurityEvent(
  event: SecurityEventType,
  details: SecurityEventDetails
) {
  try {
    const logEntry = {
      timestamp: new Date().toISOString(),
      event,
      ...details,
    };

    console.warn("🚨 SECURITY EVENT:", JSON.stringify(logEntry, null, 2));

    if (process.env.ENABLE_SECURITY_LOGGING !== "false") {
      await prisma.securityEvent.create({
        data: {
          event,
          severity: getSeverity(event),
          url: details.url,
          shortCode: details.shortCode,
          userId: details.userId,
          ipAddress: details.ip,
          userAgent: details.userAgent,
          reason: details.reason,
          metadata: details.metadata
            ? JSON.parse(JSON.stringify(details.metadata))
            : null,
        },
      });
    }
  } catch (error) {
    console.error("Failed to log security event:", error);
  }
}

function getSeverity(event: SecurityEventType): string {
  switch (event) {
    case "MALICIOUS_URL_BLOCKED":
      return "HIGH";
    case "RATE_LIMIT_EXCEEDED":
      return "MEDIUM";
    case "SUSPICIOUS_ACTIVITY":
      return "HIGH";
    case "INVALID_URL_PATTERN":
      return "LOW";
    default:
      return "MEDIUM";
  }
}

export function getRequestDetails(headers: Headers) {
  return {
    ip: headers.get("x-forwarded-for") ?? "127.0.0.1",
    userAgent: headers.get("user-agent") ?? "unknown",
  };
}
