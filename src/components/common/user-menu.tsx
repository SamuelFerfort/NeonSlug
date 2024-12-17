"use client";

import { LogOut, User } from "lucide-react";
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

export function UserMenu({ user }: UserMenuProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className="relative h-8 w-8 rounded-full hover:bg-gray-800/50 transition-colors"
        >
          <Avatar className="h-9 w-9">
            <AvatarImage
              src={user.image ?? ""}
              alt={user.name ?? "User avatar"}
            />
            <AvatarFallback className="bg-gray-700">
              <User className="h-4 w-4 text-gray-300" />
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
              <p className="text-sm font-medium text-gray-100">{user.name}</p>
              <p className="text-xs text-gray-400 truncate">{user.email}</p>
            </div>
          </DropdownMenuLabel>
        </div>

        <DropdownMenuSeparator className="bg-gray-800" />

        <div className="p-1">
          <form action={handleSignOut}>
            <DropdownMenuItem
              className="text-red-400 hover:text-red-300 hover:bg-red-950/50 cursor-pointer focus:bg-red-950/50 focus:text-red-300"
              asChild
            >
              <button
                type="submit"
                className="w-full flex items-center px-2 py-1.5"
              >
                <LogOut className="mr-2 h-4 w-4" />
                <span>Log out</span>
              </button>
            </DropdownMenuItem>
          </form>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
