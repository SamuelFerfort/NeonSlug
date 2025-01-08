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
import { limiter } from "./rate-limiter";
import { headers } from "next/headers";
import { createSimpleUrl } from "./db/url";

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

  if (!session?.user?.id) {
    return {
      error: "Please sign in to create short URLs",
    };
  }

  try {
    // Get and transform the form data
    const urlValue = formData.get("url")?.toString().trim() || "";
    const customSlugValue =
      formData.get("customSlug")?.toString().trim() || undefined;
    const passwordValue = formData.get("password")?.toString() || undefined;
    const expiresInValue = formData.get("expiresIn")?.toString() || "never";

    // Create the validation object
    const validatedFields = urlSchema.safeParse({
      url: urlValue,
      customSlug: customSlugValue,
      password: passwordValue,
      expiresIn: expiresInValue,
      tags: [], // Since your form doesn't currently handle tags, provide empty array
    });


    if (!validatedFields.success) {
      return {
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
          error: "This short code is already taken",
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

    await prisma.url.delete({
      where: {
        id: urlId,
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

  if (!session?.user?.id) {
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
      password: formData.get("password"),
      expiresIn: formData.get("expiresIn") || "never",
      tags: formData.getAll("tags"),
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

    if (!existingUrl || existingUrl.userId !== session.user.id) {
      return {
        error: "You don't have permission to update this URL",
      };
    }

    await prisma.url.update({
      where: { id: urlId },
      data: {
        password: validatedFields.data.password,
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

  if (password !== url.password) {
    return { error: "Invalid password", password, shortCode };
  }

  redirect(url.originalUrl);
}
