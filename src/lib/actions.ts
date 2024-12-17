"use server";

import { signOut, auth } from "@/src/auth";
import prisma from "./prisma";
import { nanoid } from "nanoid";
import type { UrlState, SimpleUrlState } from "./types";
import { calculateExpiryDate } from "./utils";
import { simpleUrlSchema, urlSchema, updateUrlSchema } from "./validations";
import { revalidatePath } from "next/cache";


export async function handleSignOut() {
  await signOut();
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

    await prisma.url.create({
      data: {
        originalUrl: validatedFields.data.url,
        shortCode,
        password: validatedFields.data.password,
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
      select: { userId: true }
    });

    if (!existingUrl || existingUrl.userId !== session.user?.id) {
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