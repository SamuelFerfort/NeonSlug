import {
  Card,
  CardContent,
  CardDescription,
  CardTitle,
} from "@/src/components/ui/card";
import { Button } from "@/src/components/ui/button";
import {
  Zap,
  BarChart2,
  QrCode,
  Clock,
  Shield,
  History,
  LogIn,
} from "lucide-react";
import Link from "next/link";

export default function Features() {
  const features = [
    {
      icon: History,
      title: "Link Management",
      description: "Store, edit, and organize your shortened URLs",
    },
    {
      icon: Zap,
      title: "Custom URLs",
      description: "Create branded short links with custom slugs",
    },
    {
      icon: BarChart2,
      title: "Analytics",
      description: "Track clicks, devices statistics",
    },
    {
      icon: QrCode,
      title: "QR Code Generation",
      description: "Generate QR codes for easy mobile access",
    },
    {
      icon: Clock,
      title: "Expiry Control",
      description: "Set expiration dates for temporary links",
    },
    {
      icon: Shield,
      title: "Link Protection",
      description: "Secure links with password protection",
    },
  ];

  return (
    <section className="w-full max-w-4xl mx-auto animate-in fade-in-0 slide-in-from-bottom-4 duration-300 ">
      <div className="text-center mb-7 flex flex-col gap-3 ">
        <h2 className=" text-4xl font-bold text-center mb-2  text-balance">
        Sign In to Access All Features
        </h2>
        <div className="flex justify-center gap-4">
          <Link href="/login">
            <Button
              variant="outline"
              size="lg"
              aria-label="Sign in to get started"
              className="border-neon-pink text-neon-pink bg-transparent hover:bg-neon-pink/10 hover:text-neon-pink-glow hover:scale-105 transition-all duration-200 flex items-center gap-2 w-full sm:w-auto"
            >
              <LogIn className="w-5 h-5" />
              <span>Get Started</span>
            </Button>
          </Link>
          <a href="https://github.com/SamuelFerfort/neonslug" target="_blank ">
            <Button
              variant="outline"
              size="lg"
              className="border-neon-pink text-neon-pink bg-transparent hover:bg-neon-pink/10 hover:text-neon-pink-glow hover:scale-105 transition-all duration-200 flex items-center gap-2 w-full sm:w-auto"
            >
              <svg
                viewBox="0 0 24 24"
                className="w-5 h-5"
                fill="currentColor"
                aria-hidden="true"
              >
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"
                />
              </svg>
              <span>Star on GitHub</span>
            </Button>
          </a>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 z-100">
        {features.map((feature, index) => (
          <Card
            key={index}
            className="bg-gray-900 border-gray-800 hover:border-neon-pink transition-colors hover:opacity-100 hover:rotate-3 hover:scale-105"
          >
            <CardContent className="p-6 flex flex-col items-center text-center">
              <feature.icon className="w-12 h-12 text-neon-pink mb-4" />
              <CardTitle className="text-xl text-white font-semibold mb-2">
                {feature.title}
              </CardTitle>
              <CardDescription className="text-gray-400">
                {feature.description}
              </CardDescription>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
}
