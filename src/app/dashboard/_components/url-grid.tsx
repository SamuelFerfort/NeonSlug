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
  MousePointerClick,
  Loader2,
} from "lucide-react";
import { useTransition } from "react";
import { deleteUrl } from "@/src/lib/actions";
import URLDialog from "./url-dialog";
import CopyIcon from "@/src/components/common/copy-button";
import { QRCodeDialog } from ".//qrcode-dialog";

export default function URLsGrid({ urls }: URLsGridProps) {
  const [isPending, startTransition] = useTransition();

  const truncateUrl = (url: string) => {
    return url.length > 40 ? url.substring(0, 37) + "..." : url;
  };

  const handleDelete = async (id: string) => {
    const formData = new FormData();

    formData.append("id", id);
    startTransition(() => {
      deleteUrl(formData);
    });
  };




  
  if (urls.length === 0) {
    return (
      <div className="text-gray-100 text-center mt-16">
        <h3 className="text-xl">No URLs to display</h3>
        <p className="text-lg">Create a new URL to get started 🚀</p>
      </div>
    );
  }

  return (
    <TooltipProvider>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-10  ">
        {urls.map((url) => (
          <Card
            key={url.id}
            className="bg-gray-900 border w-full border-gray-800 hover:border-neon-pink transition-all z-50"
          >
            <CardContent className="p-4">
              <div className="flex flex-col space-y-2">
                <div className="flex items-center gap-2 justify-between">
                  {/* Left side */}
                  <a
                    href={`${process.env.NEXT_PUBLIC_APP_URL}/${url.shortCode}`}
                    target="_blank"
                    className="text-lg font-mono text-neon-pink flex items-center gap-1  hover:text-neon-pink/60 transition-all"
                  >
                    /{url.shortCode}
                    {url.password && (
                      <Lock className="w-4 h-4 text-neon-pink" />
                    )}
                  </a>

                  {/* Middle section */}

                  <div className="flex   items-center space-x-4">
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <div className="flex items-center space-x-1">
                          <MousePointerClick
                            className="text-gray-400"
                            size={16}
                          />
                          <span className="text-neon-pink">
                            {url.analytics?.totalClicks || 0}
                          </span>
                        </div>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Total Clicks</p>
                      </TooltipContent>
                    </Tooltip>

                    <Tooltip>
                      <TooltipTrigger asChild>
                        <div className=" items-center space-x-1 hidden sm:flex">
                          <Laptop className="w-4 h-4 text-gray-400" />
                          <span className="text-sm text-gray-400">
                            {url.analytics?.deviceStats?.desktop || 0}
                          </span>
                        </div>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Desktop Clicks</p>
                      </TooltipContent>
                    </Tooltip>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <div className=" items-center hidden sm:flex space-x-1">
                          <Smartphone className="w-4 h-4 text-gray-400" />
                          <span className="text-sm text-gray-400">
                            {url.analytics?.deviceStats?.mobile || 0}
                          </span>
                        </div>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Mobile Clicks</p>
                      </TooltipContent>
                    </Tooltip>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <div className="items-center space-x-1 hidden sm:flex">
                          <Tablet className="w-4 h-4 text-gray-400" />
                          <span className="text-sm text-gray-400">
                            {url.analytics?.deviceStats?.tablet || 0}
                          </span>
                        </div>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Tablet Clicks</p>
                      </TooltipContent>
                    </Tooltip>
                  </div>
                  {/* Right side */}
                  <div className="flex items-center ">
                    <Tooltip>
                      <TooltipTrigger className="flex items-center">
                        <CopyIcon
                          textToCopy={`${process.env.NEXT_PUBLIC_APP_URL}/${url.shortCode}`}
                        />
                      </TooltipTrigger>
                      <TooltipContent className="z-50">
                        <p>Copy URL</p>
                      </TooltipContent>
                    </Tooltip>

                    <Tooltip>
                      <TooltipTrigger>
                        <QRCodeDialog
                          url={`${process.env.NEXT_PUBLIC_APP_URL}/${url.shortCode}`}
                        />
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>QR Code</p>
                      </TooltipContent>
                    </Tooltip>
                    <Tooltip>
                      <TooltipTrigger>
                        <URLDialog
                          mode="edit"
                          url={url}
                          trigger={
                            <Button
                              variant="ghost"
                              size="sm"
                              className="text-gray-400  hover:text-gray-300  transition-colors hover:scale-110 hover:bg-transparent"
                            >
                              <Settings size={16} />
                            </Button>
                          }
                        />
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Edit URL</p>
                      </TooltipContent>
                    </Tooltip>

                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-gray-400  hover:bg-transparent hover:text-red-500 transition-colors hover:scale-110"
                        >
                          <Trash2 size={16} />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent className="bg-gray-900 border border-gray-800">
                        <AlertDialogHeader>
                          <AlertDialogTitle>Delete Short URL</AlertDialogTitle>
                          <AlertDialogDescription className="text-gray-400">
                            Are you sure you want to delete{" "}
                            <span className="text-neon-pink-glow">
                              /{url.shortCode}
                            </span>
                            ? This action cannot be undone.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel className="bg-gray-800 hover:bg-gray-700 text-white hover:text-white">
                            Cancel
                          </AlertDialogCancel>

                          <Button
                            variant="destructive"
                            className="bg-red-500 hover:bg-red-600"
                            onClick={() => handleDelete(url.id)}
                            disabled={isPending}
                          >
                            {isPending ? (
                              <>
                                <Loader2 size={16} className=" animate-spin" />
                                Deleting...
                              </>
                            ) : (
                              "Delete"
                            )}
                          </Button>
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
                    <Timer size={16} />
                    <span className="text-sm">
                      {url.expiresAt
                        ? `Valid until ${new Date(
                            url.expiresAt
                          ).toLocaleDateString()}`
                        : "No expiration set"}
                    </span>
                  </div>
                  <span className="text-gray-400 text-sm  ">
                    {new Date(url.createdAt).toLocaleString()}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </TooltipProvider>
  );
}
