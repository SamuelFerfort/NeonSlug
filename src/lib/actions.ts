"use server";

import { signOut, auth, signIn } from "@/src/auth";
import prisma from "./prisma";
import { nanoid } from "nanoid";
import type { UrlState, SimpleUrlState, VerifyPasswordState } from "./types";
import { calculateExpiryDate } from "./utils";
import { simpleUrlSchema, urlSchema, updateUrlSchema } from "./validations";
import { revalidatePath, revalidateTag } from "next/cache";
import { redirect } from "next/navigation";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";
import {
  limiter,
  simpleUrlLimiter,
  urlCreationLimiter,
  urlUpdateLimiter,
} from "./rate-limiter";
import { headers } from "next/headers";
import { createSimpleUrl, invalidateUrlCache, updateUrlCache } from "./db/url";
import { checkUrlSafety } from "./url-security";
import { logSecurityEvent, getRequestDetails } from "./security-logger";

export async function handleSignOut() {
  await signOut({ redirectTo: "/" });
}

export async function googleLogin() {
  await signIn("google", {
    redirectTo: "/dashboard",
  });
}

export async function githubLogin() {
  await signIn("github", {
    redirectTo: "/dashboard",
  });
}

export async function createSimpleShortUrl(
  prevState: SimpleUrlState,
  formData: FormData
) {
  try {
    // Rate limit by IP for simple URL creation
    const { ip, userAgent } = getRequestDetails(await headers());
    const { success } = await simpleUrlLimiter.limit(ip);

    if (!success) {
      await logSecurityEvent("RATE_LIMIT_EXCEEDED", {
        url: formData.get("url")?.toString(),
        ip,
        userAgent,
        reason: "Simple URL creation rate limit exceeded",
      });
      return {
        url: formData.get("url")?.toString(),
        error: "Too many requests. Please wait before creating more URLs.",
      };
    }

    const isSafe = await checkUrlSafety(formData.get("url")?.toString() || "");

    if (!isSafe) {
      await logSecurityEvent("MALICIOUS_URL_BLOCKED", {
        url: formData.get("url")?.toString(),
        ip,
        userAgent,
        reason: "Malicious URL blocked during simple URL creation",
      });
      return {
        url: formData.get("url")?.toString(),
        error:
          "This URL has been flagged as potentially harmful and cannot be shortened.",
      };
    }

    const validatedFields = simpleUrlSchema.safeParse({
      url: formData.get("url"),
    });

    if (!validatedFields.success) {
      return {
        url: formData.get("url")?.toString(),
        error: "Please enter a valid URL",
      };
    }

    const session = await auth();

    const url = await createSimpleUrl(
      validatedFields.data.url,
      session?.user?.id
    );

    return {
      shortUrl: `${process.env.NEXT_PUBLIC_APP_URL}/${url.shortCode}`,
    };
  } catch (error) {
    console.error("Error creating short URL:", error);
    return {
      url: formData.get("url")?.toString(),
      error: "Failed to create short URL",
    };
  }
}

export async function createShortURL(
  prevState: UrlState,
  formData: FormData
): Promise<Partial<UrlState>> {
  const session = await auth();
  const { ip, userAgent } = getRequestDetails(await headers());
  if (!session?.user?.id) {
    return {
      error: "Please sign in to create short URLs",
    };
  }

  // Rate limit by user ID for authenticated URL creation
  const { success } = await urlCreationLimiter.limit(session.user.id);

  if (!success) {
    await logSecurityEvent("RATE_LIMIT_EXCEEDED", {
      url: formData.get("url")?.toString(),
      userId: session?.user?.id,
      ip,
      userAgent,
      reason: "URL creation rate limit exceeded",
    });
    return {
      error: "Too many URL creations. Please wait before creating more URLs.",
    };
  }

  try {
    const urlValue = formData.get("url")?.toString().trim() || "";
    const customSlugValue =
      formData.get("customSlug")?.toString().trim() || undefined;
    const passwordValue = formData.get("password")?.toString() || undefined;
    const expiresInValue = formData.get("expiresIn")?.toString() || "never";

    const isSafe = await checkUrlSafety(urlValue);

    if (!isSafe) {
      await logSecurityEvent("MALICIOUS_URL_BLOCKED", {
        url: urlValue,
        userId: session?.user?.id,
        ip,
        userAgent,
      });
      return {
        url: urlValue,
        error:
          "This URL has been flagged as potentially harmful and cannot be shortened.",
      };
    }

    const validatedFields = urlSchema.safeParse({
      url: urlValue,
      customSlug: customSlugValue,
      password: passwordValue,
      expiresIn: expiresInValue,
    });

    if (!validatedFields.success) {
      return {
        success: false,
        url: formData.get("url")?.toString(),
        error: validatedFields.error.errors[0].message,
      };
    }

    const shortCode = validatedFields.data.customSlug || nanoid(6);

    await prisma.url.create({
      data: {
        originalUrl: validatedFields.data.url,
        shortCode,
        password: validatedFields.data.password,
        expiresAt:
          validatedFields.data.expiresIn === "never"
            ? null
            : calculateExpiryDate(validatedFields.data.expiresIn),
        userId: session.user.id,
      },
    });

    revalidatePath("/dashboard");

    return { success: true };
  } catch (error) {
    if (error instanceof PrismaClientKnownRequestError) {
      if (error.code === "P2002") {
        return {
          url: formData.get("url")?.toString(),
          error: "This custom path is already taken",
          shortUrl: formData.get("customSlug")?.toString(),
        };
      }
    }
    console.error("Error creating short URL", error);
    return {
      url: formData.get("url")?.toString(),
      error: "Something went wrong",
    };
  }
}

export async function deleteUrl(formData: FormData) {
  const session = await auth();

  if (!session?.user?.id) {
    return {
      error: "Please sign in to delete short URLs",
    };
  }

  try {
    const urlId = formData.get("id");
    if (!urlId || typeof urlId !== "string") {
      return {
        error: "Please provide a valid URL ID",
      };
    }

    const url = await prisma.url.findUnique({
      where: { id: urlId },
      select: { shortCode: true, userId: true },
    });

    if (!url) {
      return {
        error: "URL not found",
      };
    }

    if (url.userId !== session.user.id) {
      return {
        error: "You don't have permission to delete this URL",
      };
    }

    // invalidate redis cache if it exists
    await invalidateUrlCache(url.shortCode);

    await prisma.url.delete({
      where: {
        id: urlId,
        userId: session.user.id, // Additional safety check
      },
    });
    revalidateTag(`user-${session.user.id}-urls`);
    return { success: true };
  } catch (error) {
    console.error("Error deleting short URL", error);
    return {
      error: "Something went wrong",
    };
  }
}

export async function updateShortURL(
  prevState: UrlState,
  formData: FormData
): Promise<Partial<UrlState>> {
  const session = await auth();
  const { ip, userAgent } = getRequestDetails(await headers());
  if (!session?.user?.id) {
    return {
      error: "Please sign in to update short URLs",
    };
  }

  const { success } = await urlUpdateLimiter.limit(session.user.id);

  if (!success) {
    await logSecurityEvent("RATE_LIMIT_EXCEEDED", {
      url: formData.get("url")?.toString().trim() || "",
      userId: session?.user?.id,
      ip,
      userAgent,
      reason: "URL update rate limit exceeded",
    });
    return {
      error: "Too many URL updates. Please wait before updating more URLs.",
    };
  }

  try {
    const urlId = formData.get("id")?.toString();

    if (!urlId) {
      return {
        error: "URL ID is required",
      };
    }

    const isSafe = await checkUrlSafety(
      formData.get("url")?.toString().trim() || ""
    );

    if (!isSafe) {
      await logSecurityEvent("MALICIOUS_URL_BLOCKED", {
        url: formData.get("url")?.toString().trim() || "",
        userId: session?.user?.id,
        ip,
        userAgent,
        reason: "Malicious URL blocked during update",
      });
      return {
        url: formData.get("url")?.toString().trim() || "",
        error:
          "This URL has been flagged as potentially harmful and cannot be shortened.",
      };
    }

    const validatedFields = updateUrlSchema.safeParse({
      url: formData.get("url")?.toString().trim() || "",
      password: formData.get("password"),
      expiresIn: formData.get("expiresIn") || "never",
    });

    if (!validatedFields.success) {
      return {
        success: false,
        error: validatedFields.error.errors[0].message,
      };
    }

    const existingUrl = await prisma.url.findUnique({
      where: { id: urlId },
      select: { userId: true, shortCode: true },
    });

    if (!existingUrl) {
      return {
        success: false,
        error: "URL not found",
      };
    }

    if (existingUrl.userId !== session.user.id) {
      return {
        success: false,
        error: "You don't have permission to update this URL",
      };
    }

    const updated = await prisma.url.update({
      where: {
        id: urlId,
        userId: session.user.id, // Additional safety check
      },
      data: {
        originalUrl: validatedFields.data.url,
        password: validatedFields.data.password,
        expiresAt:
          validatedFields.data.expiresIn === "never"
            ? null
            : calculateExpiryDate(validatedFields.data.expiresIn),
      },
    });
    // update redis cache if it exists
    await updateUrlCache(updated.shortCode, updated);
    revalidatePath("/dashboard");
    return { success: true };
  } catch (error) {
    console.error("Error updating short URL", error);
    return {
      error: "Something went wrong",
    };
  }
}

export async function verifyPassword(
  prevState: VerifyPasswordState,
  formData: FormData
): Promise<VerifyPasswordState> {
  const password = formData.get("password") as string;
  const shortCode = formData.get("shortCode") as string;
  const session = await auth();
  const { ip, userAgent } = getRequestDetails(await headers());
  const identifier = `${ip}:${shortCode}`;

  const { success } = await limiter.limit(identifier);

  if (!success) {
    await logSecurityEvent("RATE_LIMIT_EXCEEDED", {
      userId: session?.user?.id,
      shortCode,
      ip,
      userAgent,
      reason: "Password verification rate limit exceeded",
    });
    return {
      error: "Too many attempts. Please wait 1 minute before trying again.",
      password,
      shortCode,
    };
  }

  if (!password) {
    return {
      error: "Password is required",
      password: password,
      shortCode: shortCode,
    };
  }

  const url = await prisma.url.findUnique({
    where: { shortCode },
  });

  if (!url || !url.isActive || !url.password) {
    return { error: "URL not found", password, shortCode };
  }

  if (password !== url.password) {
    return { error: "Invalid password", password, shortCode };
  }

  redirect(url.originalUrl);
}
