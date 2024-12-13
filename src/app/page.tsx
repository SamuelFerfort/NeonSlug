import URLShortener from "@/src/components/layout/url-shortener";
import PremiumFeatures from "../components/layout/premium-features";

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-950 text-gray-100  flex flex-col">
      <main className="flex-grow container mx-auto px-4 py-14 flex flex-col items-center justify-center space-y-16">
        <h1 className="text-5xl md:text-7xl font-bold text-center">
          Neon<span className="text-neon-pink">Slug</span>
        </h1>
        <URLShortener />
        <PremiumFeatures />
      </main>
    </div>
  );
}
