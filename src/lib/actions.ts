"use server";

import { signIn, signOut, auth } from "@/src/auth";
import { z } from "zod";
import prisma from "./prisma";
import { nanoid } from "nanoid";
import type { UrlState } from "./types";

//Auth actions
export async function handleSignOut() {
  await signOut();
}
export async function handleSignIn() {
  await signIn("github");
}

const urlSchema = z.object({
  url: z.string().url(),
});

export async function createShortUrl(prevState: UrlState, formData: FormData) {
  try {
    const validatedFields = urlSchema.safeParse({
      url: formData.get("url"),
    });

    if (!validatedFields.success) {
      return {
        url: formData.get("url")?.toString(),
        error: "Please enter a valid URL"
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
