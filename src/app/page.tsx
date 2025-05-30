import URLShortener from "@/src/components/layout/url-shortener";
import Features from "../components/layout/features";
import { auth } from "../auth";
import { redirect } from "next/navigation";
import Hero from "../components/layout/hero";
export default async function Home() {
  const session = await auth();

  if (session) {
    redirect("/dashboard");
  }

  return (
    <main
      className="min-h-[calc(100vh-36px)] container mx-auto px-4 pt-20 sm:pt-[80px]
      py-5 flex flex-col items-center justify-center gap-5"
    >
      <Hero />
      <URLShortener />
      <Features />
    </main>
  );
}
