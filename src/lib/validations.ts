import { z } from "zod";

// Constants for validation
const MAX_TAG_LENGTH = 10;
const MAX_CUSTOM_SLUG_LENGTH = 10;
const MAX_PASSWORD_LENGTH = 40;
const VALID_EXPIRATION_VALUES = ["never", "1d", "7d", "30d"] as const;

export const urlSchema = z.object({
  // Required field
  url: z.string().url("Please enter a valid URL").min(1, "URL is required"),

  // Optional custom slug with validation
  customSlug: z
    .string()
    .max(MAX_CUSTOM_SLUG_LENGTH)
    .transform((str) => str.trim())
    .refine((str) => str === "" || /^[a-zA-Z0-9-]+$/.test(str), {
      message: "Custom link can only contain letters, numbers, and hyphens",
    })
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

  // Tags array
  tags: z
    .array(
      z
        .string()
        .max(MAX_TAG_LENGTH, `Tag cannot exceed ${MAX_TAG_LENGTH} characters`)
        .regex(
          /^[a-zA-Z0-9-]+$/,
          "Tags can only contain letters, numbers, and hyphens"
        )
    )
    .refine((arr) => arr.length === 0 || arr.every((tag) => tag.length > 0), {
      message: "Invalid tags",
    })
    .default([]),
});

export const simpleUrlSchema = z.object({
  url: z.string().url(),
});


export const updateUrlSchema = z.object({
  password: z.string().optional(),
  expiresIn: z.enum(["never", "1d", "7d", "30d"]),
  tags: z.array(z.string()),
});