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
    <div className="min-h-screen text-gray-100 flex flex-col">
      <main className="flex-grow container mx-auto px-4 py-14 flex flex-col items-center justify-center space-y-16">
        <h1
          className="text-5xl md:text-7xl font-bold text-center tracking-tight 
                     animate-in fade-in-0 slide-in-from-bottom-4 duration-300"
        >
          Neon<span className="text-neon-pink">Slug</span>
        </h1>

        <div className="w-full animate-in fade-in-0 slide-in-from-bottom-4 duration-300">
          <URLShortener />
        </div>

        <div className="w-full animate-in fade-in-0 slide-in-from-bottom-4 duration-300">
          <Features />
        </div>
      </main>
    </div>
  );
}
