"use server";

import { signIn } from "@/src/auth";
import { signOut } from "@/src/auth";

//Auth actions
export async function handleSignOut() {
  await signOut();
}
export async function handleSignIn() {
  await signIn("google");
}



