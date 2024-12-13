import { Card, CardContent } from "@/src/components/ui/card";
import { Zap, BarChart2, Key, Shield, Headphones } from "lucide-react";

export default function PremiumFeatures() {
  const features = [
    {
      icon: Zap,
      title: "Custom URLs",
      description: "Create branded short links",
    },
    {
      icon: BarChart2,
      title: "Advanced Analytics",
      description: "Gain insights into your audience",
    },
    {
      icon: Key,
      title: "API Access",
      description: "Integrate with your applications",
    },
    {
      icon: Shield,
      title: "Enhanced Security",
      description: "Protect your links with passwords",
    },
    {
      icon: Headphones,
      title: "Priority Support",
      description: "Get help when you need it",
    },
  ];

  return (
    <div className="w-full max-w-4xl mx-auto">
      <h2 className="text-3xl font-bold text-center mb-8">
        Unlock Premium Features
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {features.map((feature, index) => (
          <Card
            key={index}
            className="bg-gray-900 border-gray-800 hover:border-neon-pink transition-colors"
          >
            <CardContent className="p-6 flex flex-col items-center text-center">
              <feature.icon className="w-12 h-12 text-neon-pink mb-4" />
              <h3 className="text-xl text-white font-semibold mb-2">{feature.title}</h3>
              <p className="text-gray-400">{feature.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    
    </div>
  );
}
