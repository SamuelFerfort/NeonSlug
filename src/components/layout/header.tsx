import Link from "next/link";
import { auth } from "@/src/auth";
import { UserMenu } from "../common/user-menu";

export async function Header() {
  const session = await auth();

  return (
    <header className="border-b border-gray-800 bg-gray-900/50 backdrop-blur-md fixed top-0 left-0 right-0 z-50">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        <Link href="/" className="text-2xl font-bold text-white">
          Neon<span className="text-neon-pink-glow ">Slug</span>
        </Link>
        <div className="flex justify-center items-center">
          {session?.user ? (
            <UserMenu user={session.user} />
          ) : (
            <Link href="/login">
              <button>Sign in</button>
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}
