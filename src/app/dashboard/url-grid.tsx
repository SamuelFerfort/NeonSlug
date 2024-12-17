"use client";

import { URLsGridProps } from "@/src/lib/types";
import { Card, CardContent } from "@/src/components/ui/card";
import { Button } from "@/src/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/src/components/ui/tooltip";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/src/components/ui/alert-dialog";
import {
  Trash2,
  Lock,
  Laptop,
  Smartphone,
  Tablet,
  Settings,
  Timer,
} from "lucide-react";
import { useTransition } from "react";
import { deleteUrl } from "@/src/lib/actions";
import URLDialog from "./url-dialog";
import CopyButton from "@/src/components/common/copy-button";

export default function URLsGrid({ urls }: URLsGridProps) {
  const [isPending, startTransition] = useTransition();

  const truncateUrl = (url: string) => {
    return url.length > 40 ? url.substring(0, 37) + "..." : url;
  };

  const handleDelete = (id: string) => {
    const formData = new FormData();
    formData.append("id", id);
    startTransition(() => {
      deleteUrl(formData);
    });
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-10  ">
      {urls.map((url) => (
        <Card
          key={url.id}
          className="bg-gray-900 border  w-full border-gray-800 hover:border-neon-pink transition-all  z-50  slide-in-from-bottom-5 animate-in fade-in-0 duration-300"
        >
          <CardContent className="p-4">
            <div className="flex flex-col space-y-2">
              <div className="flex items-center gap-2 justify-between">
                 {/* Left side */}
                <span className="text-lg font-mono text-neon-pink flex items-center gap-1">
                  /{url.shortCode}
                  {url.password && <Lock className="w-4 h-4 text-neon-pink" />}
                </span>

                  {/* Middle section */}
                <div className="flex items-center space-x-4">
                  <span className="text-sm text-gray-400">
                    Clicks:{" "}
                    <span className="text-neon-pink">
                      {url.analytics?.totalClicks || 0}
                    </span>
                  </span>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <div className="flex items-center space-x-1">
                          <Laptop className="w-4 h-4 text-gray-400" />
                          <span className="text-sm text-neon-pink">
                            {url.analytics?.deviceStats?.desktop || 0}
                          </span>
                        </div>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Desktop Clicks</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <div className="flex items-center space-x-1">
                          <Smartphone className="w-4 h-4 text-gray-400" />
                          <span className="text-sm text-neon-pink">
                            {url.analytics?.deviceStats?.mobile || 0}
                          </span>
                        </div>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Mobile Clicks</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <div className="flex items-center space-x-1">
                          <Tablet className="w-4 h-4 text-gray-400" />
                          <span className="text-sm text-neon-pink">
                            {url.analytics?.deviceStats?.tablet || 0}
                          </span>
                        </div>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Tablet Clicks</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
                  {/* Right side */}
                <div className="flex items-center ">
                  <CopyButton
                    textToCopy={`${process.env.NEXT_PUBLIC_APP_URL}/${url.shortCode}`}
                  />
                  <URLDialog
                    mode="edit"
                    url={url}
                    trigger={
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-gray-400  hover:text-gray-300  transition-colors hover:scale-110 hover:bg-transparent"
                      >
                        <Settings className="w-4 h-4" />
                      </Button>
                    }
                  />
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-gray-400  hover:bg-transparent hover:text-red-500 transition-colors hover:scale-110"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent className="bg-gray-900 border border-gray-800">
                      <AlertDialogHeader>
                        <AlertDialogTitle>Delete Short URL</AlertDialogTitle>
                        <AlertDialogDescription className="text-gray-400">
                          Are you sure you want to delete <span className="text-neon-pink-glow">/{url.shortCode}</span>? This
                          action cannot be undone.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel className="bg-gray-800 hover:bg-gray-700 text-white hover:text-white">
                          Cancel
                        </AlertDialogCancel>
                        <AlertDialogAction
                          className="bg-red-500 hover:bg-red-600"
                          onClick={() => handleDelete(url.id)}
                          disabled={isPending}
                        >
                          {isPending ? "Deleting..." : "Delete"}
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </div>
              <p className="text-sm text-gray-400 break-all">
                {truncateUrl(url.originalUrl)}
              </p>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1 text-gray-400">
                  <Timer className="w-4 h-4" />
                  <span className="text-sm">
                    {url.expiresAt
                      ? `Valid until ${new Date(
                          url.expiresAt
                        ).toLocaleDateString()}`
                      : "No expiration set"}
                  </span>
                </div>
                <span className="text-gray-400 text-sm">
                  {new Date(url.createdAt).toLocaleString()}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
