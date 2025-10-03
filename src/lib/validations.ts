import { z } from "zod";
import { isUrlPatternSafe } from "./utils";

// Constants for validation
const MAX_CUSTOM_SLUG_LENGTH = 10;
const MAX_PASSWORD_LENGTH = 40;
const VALID_EXPIRATION_VALUES = ["never", "1d", "7d", "30d"] as const;
const RESERVED_KEYWORDS = ["dashboard", "protected", "login"] as const;

export const urlSchema = z.object({
  // Required field
  url: z
    .string()
    .min(1, "URL is required")
    .transform((url) => {
      // Add https:// if no protocol is present
      if (!url.match(/^https?:\/\//i)) {
        return `https://${url}`;
      }
      return url;
    })
    .pipe(
      z
        .string()
        .url("Please enter a valid URL")
        .refine(
          (url) => {
            try {
              const parsed = new URL(url);
              return (
                parsed.protocol === "https:" || parsed.hostname === "localhost"
              );
            } catch {
              return false;
            }
          },
          {
            message: "URL must use HTTPS protocol",
          }
        )
        .refine(
          (url) => {
            try {
              const parsed = new URL(url);
              return parsed.hostname === "localhost" || isUrlPatternSafe(url);
            } catch {
              return false;
            }
          },
          {
            message:
              "This URL appears to be unsafe or suspicious and cannot be shortened",
          }
        )
    ),

  // Optional custom slug with validation
  customSlug: z
    .string()
    .max(MAX_CUSTOM_SLUG_LENGTH)
    .transform((str) => str.trim())
    .refine((str) => str === "" || /^[a-zA-Z0-9-]+$/.test(str), {
      message: "Custom path can only contain letters, numbers, and hyphens",
    })
    .refine(
      (str) =>
        !RESERVED_KEYWORDS.includes(str as (typeof RESERVED_KEYWORDS)[number]),
      {
        message: "This custom path is reserved and cannot be used",
      }
    )
    .transform((str) => (str === "" ? undefined : str.toLowerCase()))
    .optional(),
  // Optional password
  password: z
    .string()
    .max(
      MAX_PASSWORD_LENGTH,
      `Password cannot exceed ${MAX_PASSWORD_LENGTH} characters`
    )
    .optional()
    .transform((pw) => (pw === "" ? undefined : pw)),

  // Link expiration
  expiresIn: z.enum(VALID_EXPIRATION_VALUES).default("never"),
});

export const simpleUrlSchema = z.object({
  url: z
    .string()
    .min(1, "URL is required")
    .transform((url) => {
      // Add https:// if no protocol is present
      if (!url.match(/^https?:\/\//i)) {
        return `https://${url}`;
      }
      return url;
    })
    .pipe(
      z
        .string()
        .url("Please enter a valid URL")
        .refine(
          (url) => {
            try {
              const parsed = new URL(url);
              return (
                parsed.protocol === "https:" || parsed.hostname === "localhost"
              );
            } catch {
              return false;
            }
          },
          {
            message: "URL must use HTTPS protocol (except localhost)",
          }
        )
        .refine(
          (url) => {
            try {
              const parsed = new URL(url);
              return parsed.hostname === "localhost" || isUrlPatternSafe(url);
            } catch {
              return false;
            }
          },
          {
            message:
              "This URL appears to be unsafe or suspicious and cannot be shortened",
          }
        )
    ),
});

export const updateUrlSchema = z.object({
  url: z
    .string()
    .url("Please enter a valid URL")
    .min(1, "URL is required")
    .refine(
      (url) => {
        try {
          const parsed = new URL(url);
          return (
            parsed.protocol === "https:" || parsed.hostname === "localhost"
          );
        } catch {
          return false;
        }
      },
      {
        message: "URL must use HTTPS protocol (except localhost)",
      }
    )
    .refine(
      (url) => {
        try {
          const parsed = new URL(url);
          return parsed.hostname === "localhost" || isUrlPatternSafe(url);
        } catch {
          return false;
        }
      },
      {
        message:
          "This URL appears to be unsafe or suspicious and cannot be shortened",
      }
    ),
  password: z.string().optional(),
  expiresIn: z.enum(["never", "1d", "7d", "30d"]),
});
