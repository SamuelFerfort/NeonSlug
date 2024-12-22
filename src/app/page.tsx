import URLShortener from "@/src/components/layout/url-shortener";
import Features from "../components/layout/features";
import { auth } from "../auth";
import { redirect } from "next/navigation";

export default async function Home() {
  const session = await auth();

  if (session) {
    redirect("/dashboard");
  }

  return (
    <main className="min-h-[100dvh] container mx-auto px-4 pt-20 sm:pt-12 flex flex-col items-center justify-center gap-8">
      <div className="text-center space-y-4">
        <h1
          className="text-5xl md:text-7xl font-bold text-center tracking-tight 
                 animate-in fade-in-0 slide-in-from-bottom-4 duration-300"
        >
          Neon<span className="text-neon-pink">Slug</span>
        </h1>
        <div className="space-y-2 animate-in fade-in-0 slide-in-from-bottom-4 duration-300 delay-100">
          <p className="text-gray-400 text-lg">
            Free and open-source URL shortener
          </p>
          <p className="text-base text-gray-400">
            No tracking, no ads, just fast and reliable short links.
          </p>
        </div>
      </div>

      <div className="w-full animate-in fade-in-0 slide-in-from-bottom-4 duration-300">
        <URLShortener />
      </div>

      <div className="w-full animate-in fade-in-0 slide-in-from-bottom-4 duration-300">
        <Features />
      </div>
    </main>
  );
}

