"use client";

import { Button } from "@/src/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/src/components/ui/dialog";
import { Input } from "@/src/components/ui/input";
import { Label } from "@/src/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/src/components/ui/select";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/src/components/ui/collapsible";
import {
  ChevronDown,
  ChevronUp,
  Eye,
  EyeOff,
  Settings,
  Plus,
  Lock,
} from "lucide-react";
import { useState, useActionState, useEffect } from "react";
import { createShortURL, updateShortURL } from "@/src/lib/actions";
import { UrlState, URLDialogProps } from "@/src/lib/types";
import { getExpirationValue } from "@/src/lib/utils";

export default function URLDialog({ mode, url, trigger }: URLDialogProps) {
  const [showPassword, setShowPassword] = useState(false);
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [open, setOpen] = useState(false);
  const [password, setPassword] = useState(url?.password || "");

  const expiresIn = url?.expiresAt
    ? getExpirationValue(url.expiresAt)
    : "never";

  const initialState: UrlState = {
    url: url?.originalUrl || "",
    shortUrl: url?.shortCode,
    error: undefined,
    customSlug: url?.shortCode || "",
    password: url?.password || "",
    expiresIn,
    success: false,
  };

  const [state, formAction, isPending] = useActionState(
    mode === "create" ? createShortURL : updateShortURL,
    initialState,
  );
  useEffect(() => {
    if (state.success) {
      setOpen(false);
      setShowAdvanced(false);
    }
  }, [state]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button className="bg-transparent border border-neon-pink hover:bg-neon-pink/10 text-neon-pink text-sm">
            {mode === "create" ? (
              <div className="flex items-center gap-2">
                <span className="sm:text-lg text-sm">New Short URL</span>
                <Plus className="w-4 h-4 text-neon-pink " />
              </div>
            ) : (
              <Settings className="w-4 h-4" />
            )}
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="bg-gray-900 border border-gray-800 ">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-white">
            {mode === "create" ? "Create Short URL" : "Edit Short URL"}
          </DialogTitle>
        </DialogHeader>
        <form action={formAction} className="space-y-6">
          {state.error && (
            <div className="bg-red-500/10 border border-red-500/50 text-red-400 px-4 py-2 rounded-md text-sm">
              {state.error}
            </div>
          )}

          {/* Hidden input for edit mode to pass the URL ID */}
          {mode === "edit" && url && (
            <input type="hidden" name="id" value={url.id} />
          )}

          {!showAdvanced && (
            <>
              <input type="hidden" name="password" value={password} />
              <input type="hidden" name="expiresIn" value={expiresIn} />
            </>
          )}

          <div className="space-y-2">
            <Label htmlFor="url" className="text-gray-100">
              Long URL
            </Label>
            <div className="relative">
              <Input
                id="url"
                name="url"
                type="url"
                defaultValue={mode === "create" ? state.url : url?.originalUrl}
                placeholder="https://example.com/your/very/long/url"
                disabled={isPending}
                className="bg-gray-800 border-gray-700 text-white placeholder-gray-500 focus:border-gray-400"
                translate="no"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="customSlug" className="text-gray-100">
              Custom Path {mode === "create" ? "(Optional)" : "(Read-only)"}
            </Label>
            <div className="relative">
              <Input
                id="customSlug"
                name="customSlug"
                defaultValue={
                  mode === "create" ? state.shortUrl : url?.shortCode
                }
                placeholder="custom-path"
                disabled={isPending || mode === "edit"} // Short code can't be edited
                className="bg-gray-800 border-gray-700 text-white placeholder-gray-500 focus:border-gray-400"
              />
              {mode === "edit" && (
                <Lock className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
              )}
            </div>
            {mode === "create" && (
              <p className="text-sm text-gray-400">
                Your short URL will be: neonslug.com/custom-path
              </p>
            )}
          </div>

          <Collapsible
            open={showAdvanced}
            onOpenChange={setShowAdvanced}
            className="space-y-2"
          >
            <CollapsibleTrigger asChild>
              <Button
                variant="ghost"
                className="flex w-full justify-between p-3 text-gray-100 bg-gray-800/30 border border-gray-800 rounded-md hover:bg-gray-800/50 
                hover:text-gray-100  hover;  group active:scale-[0.99]"
              >
                <div className="flex items-center gap-2">
                  <Settings className="w-4 h-4 text-gray-400 " />
                  <span className="text-sm font-medium">Advanced Options</span>
                </div>
                <div className="flex items-center">
                  {showAdvanced ? (
                    <ChevronUp className="h-4 w-4 text-gray-400 " />
                  ) : (
                    <ChevronDown className="h-4 w-4 text-gray-400 " />
                  )}
                </div>
              </Button>
            </CollapsibleTrigger>
            <CollapsibleContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="password" className="text-gray-100">
                  Password Protection (Optional)
                </Label>
                <div className="relative">
                  <Input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter a password"
                    disabled={isPending}
                    className="bg-gray-800 border-gray-700 text-white placeholder-gray-500 focus:border-gray-400"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent text-gray-400 hover:text-gray-200"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </Button>
                </div>
                <p className="text-sm text-gray-400">
                  Users will need this password to access the URL
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="expiresIn" className="text-gray-100">
                  Link Expiration
                </Label>
                <Select
                  name="expiresIn"
                  defaultValue={expiresIn}
                  disabled={isPending}
                >
                  <SelectTrigger className="bg-gray-800 border-gray-700 text-white">
                    <SelectValue placeholder="Select expiration time" />
                  </SelectTrigger>
                  <SelectContent className="bg-gray-800 border-gray-700  text-white">
                    <SelectItem value="never">Never</SelectItem>
                    <SelectItem value="1d">1 Day</SelectItem>
                    <SelectItem value="7d">7 Days</SelectItem>
                    <SelectItem value="30d">30 Days</SelectItem>
                  </SelectContent>
                </Select>

                <p className="text-sm text-gray-400">
                  Shortened URL will be permanently deleted after the expiration
                  date
                </p>
              </div>
            </CollapsibleContent>
          </Collapsible>
          <DialogFooter>
            <Button
              type="submit"
              className={`w-full bg-transparent hover:bg-neon-pink/10 text-neon-pink border border-neon-pink relative overflow-hidden ${
                isPending ? "bg-neon-pink/10" : ""
              }`}
              disabled={isPending}
            >
              {isPending ? (
                <>
                  <span className="flex items-center gap-2">
                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-neon-pink border-t-transparent"></span>
                    {mode === "create" ? "Creating..." : "Updating..."}
                  </span>
                  <div className="absolute inset-0 w-1/4 h-full bg-gradient-to-r from-transparent via-white/10 to-transparent animate-shimmer" />
                </>
              ) : mode === "create" ? (
                "Create Short URL"
              ) : (
                "Update URL"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
