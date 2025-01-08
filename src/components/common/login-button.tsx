// LoginButton.tsx (Client Component)
"use client";

import { Loader2 } from "lucide-react";
import { Button } from "@/src/components/ui/button";
import { useFormStatus } from "react-dom";
import { cn } from "@/src/lib/utils";

type LoginButtonProps = {
  icon: React.ReactNode;
  provider: string;
};

export default function LoginButton({ icon, provider }: LoginButtonProps) {
  const { pending } = useFormStatus();

  return (
    <Button
      className={cn(
        "w-full text-white transition-all relative overflow-hidden",
        pending ? "bg-neon-pink/20" : "hover:bg-neon-pink/10"
      )}
      disabled={pending}
    >
      {pending ? (
        <>
        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
        <div className="absolute inset-0 w-1/4 h-full bg-gradient-to-r from-transparent via-white/10 to-transparent animate-shimmer" />
        </>
      ) : (
        <div className="mr-2 h-4 w-4">{icon}</div>
      )}
      {pending ? "Connecting..." : `Continue with ${provider}`}
      
    </Button>
  );
}
