import Link from "next/link"
import { Button } from "@/src/components/ui/button"

export function Header() {
  return (
    <header className="border-b border-gray-800 bg-gray-900/50 backdrop-blur-md fixed top-0 left-0 right-0 z-50">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <Link href="/" className="text-2xl font-bold text-white">
          Neon<span className="text-neon-pink">Link</span>
        </Link>
        <nav>
          <Button variant="ghost" className="text-gray-300 hover:text-white">
            Login
          </Button>
          <Button className="ml-4 bg-neon-pink hover:bg-neon-pink/90 text-white">
            Sign Up
          </Button>
        </nav>
      </div>
    </header>
  )
}

