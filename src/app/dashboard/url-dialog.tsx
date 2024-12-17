"use client";

import { Button } from "@/src/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
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
} from "lucide-react";
import { useState, useActionState, useEffect } from "react";
import { createShortURL, updateShortURL } from "@/src/lib/actions";
import { UrlState, URLDialogProps } from "@/src/lib/types";
import { getExpirationValue } from "@/src/lib/utils";

export default function URLDialog({ mode, url, trigger }: URLDialogProps) {
  const [tags, setTags] = useState<string[]>(url?.tags || []);
  const [showPassword, setShowPassword] = useState(false);
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [open, setOpen] = useState(false);

  const initialState: UrlState = {
    url: url?.originalUrl || "",
    shortUrl: url?.shortCode,
    error: undefined,
    customSlug: url?.shortCode || "",
    password: url?.password || undefined,
    expiresIn: url?.expiresAt ? getExpirationValue(url.expiresAt) : "never",
    tags: url?.tags || [],
    success: false,
  };

  const [state, formAction, isPending] = useActionState(
    mode === "create" ? createShortURL : updateShortURL,
    initialState
  );

  useEffect(() => {
    if (state.success) {
      setOpen(false);
    }
  }, [state.success]);

  const handleTagInput = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      const input = e.currentTarget;
      const value = input.value.trim();
      if (value && !tags.includes(value)) {
        setTags([...tags, value]);
        input.value = "";
      }
    }
  };

  const removeTag = (tagToRemove: string) => {
    setTags(tags.filter((tag) => tag !== tagToRemove));
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button className="bg-neon-pink hover:bg-neon-pink/90">
            {mode === "create" ? (
              <div className="flex items-center gap-2">
                <span className="text-lg">Shorten new URL</span>
                <Plus className="w-4 h-4 text-white " />
              </div>
            ) : (
              <Settings className="w-4 h-4" />
            )}
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="bg-gray-900 border-gray-800">
        <DialogHeader>
          <DialogTitle>
            {mode === "create" ? "Create Short URL" : "Edit Short URL"}
          </DialogTitle>
          <DialogDescription>
            {mode === "create"
              ? "Enter a long URL to create a shorter, easier to share version."
              : "Modify your shortened URL settings."}
          </DialogDescription>
        </DialogHeader>
        <form action={formAction} className="space-y-4">
          {state.error && (
            <div className="bg-red-500/20 border border-red-500 text-red-500 px-4 py-2 rounded-md text-sm">
              {state.error}
            </div>
          )}

          {/* Hidden input for edit mode to pass the URL ID */}
          {mode === "edit" && url && (
            <input type="hidden" name="id" value={url.id} />
          )}

          <div className="space-y-2">
            <Label htmlFor="url">Long URL*</Label>
            <Input
              id="url"
              name="url"
              type="url"
              defaultValue={url?.originalUrl}
              placeholder="https://example.com/your/very/long/url"
              disabled={isPending || mode === "edit"} // URL can't be edited in edit mode
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="customSlug">
              Custom Short Link {mode === "create" ? "(Optional)" : ""}
            </Label>
            <Input
              id="customSlug"
              name="customSlug"
              defaultValue={url?.shortCode}
              placeholder="/my-brand"
              disabled={isPending || mode === "edit"} // Short code can't be edited
            />
            {mode === "create" && (
              <p className="text-sm text-gray-400">
                Your short URL will be: neonslug.com/your-custom-text
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
                className="flex w-full justify-between p-1"
              >
                Advanced Options
                {showAdvanced ? (
                  <ChevronUp className="h-4 w-4" />
                ) : (
                  <ChevronDown className="h-4 w-4" />
                )}
              </Button>
            </CollapsibleTrigger>
            <CollapsibleContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="password">Password Protection (Optional)</Label>
                <div className="relative">
                  <Input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    defaultValue={url?.password ?? ""}
                    placeholder="Enter a password"
                    disabled={isPending}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4 text-gray-400" />
                    ) : (
                      <Eye className="h-4 w-4 text-gray-400" />
                    )}
                  </Button>
                </div>
                <p className="text-sm text-gray-400">
                  Users will need this password to access the URL
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="expiresIn">Link Expiration</Label>
                <Select
                  name="expiresIn"
                  defaultValue={url?.expiresAt ? "custom" : "never"}
                  disabled={isPending}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select expiration time" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="never">Never</SelectItem>
                    <SelectItem value="1d">1 Day</SelectItem>
                    <SelectItem value="7d">7 Days</SelectItem>
                    <SelectItem value="30d">30 Days</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="tags">Tags</Label>
                <div className="flex flex-wrap gap-2 mb-2">
                  {tags.map((tag, index) => (
                    <>
                      <input
                        type="hidden"
                        name="tags"
                        value={tag}
                        key={`tag-input-${index}`}
                      />
                      <span
                        key={`tag-display-${index}`}
                        className="bg-neon-pink/20 text-neon-pink px-2 py-1 rounded-md text-sm flex items-center gap-1"
                      >
                        {tag}
                        <button
                          type="button"
                          onClick={() => removeTag(tag)}
                          className="hover:text-white"
                        >
                          ×
                        </button>
                      </span>
                    </>
                  ))}
                </div>
                <Input
                  id="tagInput"
                  name="tagInput"
                  disabled={isPending}
                  placeholder="Enter tags (press Enter or comma to add)"
                  onKeyDown={handleTagInput}
                />
                <p className="text-sm text-gray-400">
                  Press Enter or comma to add tags
                </p>
              </div>
            </CollapsibleContent>
          </Collapsible>
          <DialogFooter>
            <Button type="submit" className="w-full" disabled={isPending}>
              {isPending ? (
                <span className="flex items-center gap-2">
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></span>
                  {mode === "create" ? "Creating..." : "Updating..."}
                </span>
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
