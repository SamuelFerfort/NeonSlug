import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-4">
      <h1 className="text-8xl font-bold text-neon-pink animate-pulse">404</h1>
      <p className="mt-6 text-xl text-gray-300">Short URL not found</p>
      <p className="mt-3 text-gray-400 text-center">
        This link may have expired or never existed.
      </p>
      <Link
        href="/"
        className="mt-8 px-6 py-2 border border-neon-pink text-neon-pink hover:bg-neon-pink/10 transition-all rounded-md"
      >
        Go Home
      </Link>
    </div>
  );
}
