import URLShortener from "@/src/components/layout/url-shortener";
import { auth } from "../auth";
import { redirect } from "next/navigation";
import Features from "../components/layout/premium-features";

export default async function Home() {
  const session = await auth();

  if (session) {
    redirect("/dashboard");
  }

  return (
    <div className="min-h-screen  text-gray-100  flex flex-col">
      <main className="flex-grow container mx-auto px-4 py-14 flex flex-col items-center justify-center space-y-16">
        <h1 className="text-5xl md:text-7xl font-bold text-center">
          Neon<span className="text-neon-pink">Slug</span>
        </h1>
        <URLShortener />
        <Features />
      </main>
    </div>
  );
}
