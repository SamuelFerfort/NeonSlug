import Link from "next/link";
import { Button } from "@/src/components/ui/button";
import { auth } from "@/src/auth";
import SignIn from "../common/sign-in";

export async function Header() {
  const session = await auth();

  return (
    <header className="border-b border-gray-800 bg-gray-900/50 backdrop-blur-md fixed top-0 left-0 right-0 z-50">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <Link href="/" className="text-2xl font-bold text-white">
          Neon<span className="text-neon-pink">Link</span>
        </Link>
        <nav>{session ? session.user?.name : <SignIn />}</nav>
      </div>
    </header>
  );
}
