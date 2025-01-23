"use client";

import { User, BugIcon, ArrowUpRight, LogOut, Loader2 } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/src/components/ui/dropdown-menu";
import {
  Avatar,
  AvatarImage,
  AvatarFallback,
} from "@/src/components/ui/avatar";
import { Button } from "@/src/components/ui/button";
import { handleSignOut } from "@/src/lib/actions";
import type { UserMenuProps } from "@/src/lib/types";
import X from "@/src/components/icons/X";

import { toast } from "sonner";

export function UserMenu({ user }: UserMenuProps) {
  const size = 16;

  const onSubmit = async () => {
    toast("Logging out...", {
      icon: <Loader2 className="w-4 h-4 text-neon-pink animate-spin" />,
      duration: 2000,
      position: "bottom-right",
    });

    await handleSignOut();
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className="relative h-9 w-9 rounded-full hover:bg-gray-800/50 transition-colors"
        >
          <Avatar className="h-9 w-9">
            <AvatarImage
              src={user?.image ?? ""}
              alt={user?.name ?? "User avatar"}
            />
            <AvatarFallback className="bg-gray-700">
              <User className="h-9 w-9 text-gray-300" />
            </AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        className="w-48 bg-gray-900 border border-gray-800 shadow-xl"
        align="end"
      >
        <div className="space-y-1">
          <DropdownMenuLabel className="font-normal">
            <div className="flex flex-col space-y-1">
              <p className="text-sm font-medium text-gray-100">{user?.name}</p>
              <p className="text-xs text-gray-400 truncate">{user?.email}</p>
            </div>
          </DropdownMenuLabel>
        </div>

        <DropdownMenuSeparator className="bg-gray-800" />
        <DropdownMenuItem
          asChild
          className="flex w-full items-center justify-between text-gray-100 data-[highlighted]:bg-gray-500/10 hover:bg-gray-500/10 cursor-pointer hover:text-white"
        >
          <a
            href="https://github.com/SamuelFerfort/NeonSlug/issues/new?template=Blank+issue"
            target="_blank"
          >
            <div className="flex items-center space-x-3 text-gray-100">
              <BugIcon size={size} />
              <span className="text-gray-100">Report a bug</span>
            </div>
            <ArrowUpRight size={size} className="opacity-40 text-gray-100" />
          </a>
        </DropdownMenuItem>
        <DropdownMenuItem
          asChild
          className="flex w-full items-center justify-between text-gray-100 data-[highlighted]:bg-gray-500/10 hover:bg-gray-500/10 cursor-pointer hover:text-white"
        >
          <a href="https://twitter.com/SamuxLoL" target="_blank">
            <div className="flex items-center space-x-3   ">
              <X width={size} />
              <span className="text-gray-100">Contact</span>
            </div>
            <ArrowUpRight size={size} className="opacity-40 text-gray-100" />
          </a>
        </DropdownMenuItem>
        <DropdownMenuItem
          className="flex w-full items-center justify-between  text-red-500 data-[highlighted]:bg-gray-500/10 hover:bg-gray-500/10 cursor-pointer hover:text-red-500"
          asChild
        >
          <form action={onSubmit}>
            <button
              type="submit"
              className="w-full flex items-center space-x-3 text-red-500"
            >
              <LogOut size={size} />
              <span>Log out</span>
            </button>
          </form>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
