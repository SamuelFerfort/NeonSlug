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
      title: "Advanced Analytics",
      description: "Track clicks, devices, and visitor insights",
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
    <div className="w-full max-w-4xl mx-auto">
      <div className="text-center mb-4">
        <h2 className="text-3xl font-bold text-center mb-2">
          Sign In to Unlock Premium Features
        </h2>
        <Link href="/login" className="text-center flex justify-center">
          <Button
            variant="outline"
            size="lg"
            className="border-neon-pink text-neon-pink bg-transparent hover:bg-neon-pink/10 hover:text-neon-pink-glow transition-colors flex items-center gap-2"
          >
            <LogIn className="w-5 h-5" />
            <span>Get Started</span>
          </Button>
        </Link>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 z-100">
        {features.map((feature, index) => (
          <Card
            key={index}
            className="bg-gray-900 border-gray-800 hover:border-neon-pink transition-colors"
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
    </div>
  );
}
