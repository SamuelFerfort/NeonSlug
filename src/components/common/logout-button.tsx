"use client";

import { LogOut } from "lucide-react";
import { toast } from "sonner";
import { useTransition } from "react";

interface LogoutButtonProps {
  handleSignOut: (formData: FormData) => Promise<void>;
  size?: number;
}

export default function LogoutButton({
  handleSignOut,
  size = 16,
}: LogoutButtonProps) {
  const [isPending, startTransition] = useTransition();

  const onSubmit = async (formData: FormData) => {
    if (isPending) return;

    toast("Logging out...", {
      icon: <LogOut className="w-4 h-4 text-neon-pink animate-spin" />,
      duration: 1000,
    });

    startTransition(async () => {
      await handleSignOut(formData);
    });
  };

  return (
    <form action={onSubmit}>
      <button
        type="submit"
        className="pl-2 w-full flex items-center space-x-4 text-red-500 disabled:opacity-50 transition-opacity"
        disabled={isPending}
      >
        <LogOut size={size} className={isPending ? "animate-spin" : ""} />
        <span>{isPending ? "Logging out..." : "Log out"}</span>
      </button>
    </form>
  );
}
