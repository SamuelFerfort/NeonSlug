"use client";

import { LogOut, User, BugIcon, ArrowUpRight } from "lucide-react";
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
import Link from "next/link";
import X from "@/src/components/icons/X";

export function UserMenu({ user }: UserMenuProps) {
  const size = 16;

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
          className="flex w-full items-center justify-between text-gray-100 hover:bg-gray-500/10 hover:border border-none cursor-pointer"
        >
          <a
            href="https://github.com/SamuelFerfort/NeonSlug/issues/new/choose"
            target="_blank"
          >
            <div className="flex items-center space-x-3">
              <BugIcon size={size} />
              <span>Report a bug</span>
            </div>
            <ArrowUpRight size={size} className="opacity-40" />
          </a>
        </DropdownMenuItem>
        <DropdownMenuItem
          asChild
          className="flex w-full items-center justify-between text-gray-100 hover:bg-gray-500/10 "
        >
          <a href="https://twitter.com/SamuxLoL" target="_blank">
            <div className="flex items-center space-x-3   ">
              <X width={size} />
              <span>Contact</span>
            </div>
            <ArrowUpRight size={size} className="opacity-40" />
          </a>
        </DropdownMenuItem>
        <DropdownMenuItem
          className="text-red-400  hover:bg-gray-500/10 hover:border border-none cursor-pointer  "
          asChild
        >
          <form action={handleSignOut}>
            <button
              type="submit"
              className="w-full flex items-center space-x-3 "
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
