"use server";

import { signOut, auth, signIn } from "@/src/auth";
import prisma from "./prisma";
import { nanoid } from "nanoid";
import type { UrlState, SimpleUrlState, VerifyPasswordState } from "./types";
import { calculateExpiryDate } from "./utils";
import { simpleUrlSchema, urlSchema, updateUrlSchema } from "./validations";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import bcrypt from "bcryptjs";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";
import { limiter } from "./rate-limiter";
import { headers } from "next/headers";

export async function handleSignOut() {
  await signOut({ redirectTo: "/" });
}

export async function googleLogin() {
  "use server";
  await signIn("google", {
    redirectTo: "/dashboard",
  });
}

export async function githubLogin() {
  "use server";
  await signIn("github", {
    redirectTo: "/dashboard",
  });
}

export async function createSimpleShortUrl(
  prevState: SimpleUrlState,
  formData: FormData
) {
  try {
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

    const shortCode = nanoid(6);

    const url = await prisma.url.create({
      data: {
        originalUrl: validatedFields.data.url,
        shortCode,
        userId: session?.user?.id || null, // Associate with user only if logged in
      },
    });

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

async function hashPassword(password: string) {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(password, salt);
}

export async function createShortURL(
  prevState: UrlState,
  formData: FormData
): Promise<Partial<UrlState>> {
  const session = await auth();

  if (!session) {
    return {
      error: "Please sign in to create short URLs",
    };
  }

  try {
    const validatedFields = urlSchema.safeParse({
      url: formData.get("url"),
      customSlug: formData.get("customSlug")?.toString() || "",
      password: formData.get("password")?.toString() || "",
      expiresIn: formData.get("expiresIn")?.toString() || "never",
      tags: formData.getAll("tags").map((tag) => tag.toString()),
    });

    if (!validatedFields.success) {
      return {
        url: formData.get("url")?.toString(),
        error: validatedFields.error.errors[0].message,
      };
    }

    const shortCode = validatedFields.data.customSlug || nanoid(6);

    const hashedPassword = validatedFields.data.password
      ? await hashPassword(validatedFields.data.password)
      : null;

    await prisma.url.create({
      data: {
        originalUrl: validatedFields.data.url,
        shortCode,
        password: hashedPassword,
        expiresAt:
          validatedFields.data.expiresIn === "never"
            ? null
            : calculateExpiryDate(validatedFields.data.expiresIn),
        tags: validatedFields.data.tags,
        userId: session.user?.id,
      },
    });

    revalidatePath("/dashboard");
    return { success: true };
  } catch (error) {
    if (error instanceof PrismaClientKnownRequestError) {
      if (error.code === "P2002") {
        return {
          url: formData.get("url")?.toString(),
          error: "This short code is already taken",
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

  if (!session) {
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

    await prisma.url.delete({
      where: {
        id: urlId,
      },
    });

    revalidatePath("/dashboard");
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

  if (!session) {
    return {
      error: "Please sign in to update short URLs",
    };
  }

  try {
    const urlId = formData.get("id")?.toString();

    if (!urlId) {
      return {
        error: "URL ID is required",
      };
    }

    const validatedFields = updateUrlSchema.safeParse({
      password: formData.get("password")?.toString() || "",
      expiresIn: formData.get("expiresIn")?.toString() || "never",
      tags: formData.getAll("tags").map((tag) => tag.toString()),
    });

    if (!validatedFields.success) {
      return {
        error: validatedFields.error.errors[0].message,
      };
    }

    const existingUrl = await prisma.url.findUnique({
      where: { id: urlId },
      select: { userId: true },
    });

    if (!existingUrl || existingUrl.userId !== session.user?.id) {
      return {
        error: "You don't have permission to update this URL",
      };
    }

    const hashedPassword = validatedFields.data.password
      ? await hashPassword(validatedFields.data.password)
      : undefined;

    await prisma.url.update({
      where: { id: urlId },
      data: {
        password: hashedPassword,
        expiresAt:
          validatedFields.data.expiresIn === "never"
            ? null
            : calculateExpiryDate(validatedFields.data.expiresIn),
        tags: validatedFields.data.tags,
      },
    });

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

  // Rate limit by IP and shortCode combination
  const ip = (await headers()).get("x-forwarded-for") ?? "127.0.0.1";
  const identifier = `${ip}:${shortCode}`;

  const { success } = await limiter.limit(identifier);

  if (!success) {
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

  const isValidPassword = await bcrypt.compare(password, url.password);

  if (!isValidPassword) {
    return { error: "Invalid password", password, shortCode };
  }

  redirect(url.originalUrl);
}
