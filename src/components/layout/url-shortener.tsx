"use client";

import { useActionState } from "react";
import { Input } from "@/src/components/ui/input";
import { Button } from "../ui/button";
import { createSimpleShortUrl } from "@/src/lib/actions";
import type { SimpleUrlState } from "@/src/lib/types";
import CopyButton from "@/src/components/common/copy-button";
import { AlertCircle, Loader2 } from "lucide-react";

export default function URLShortener() {
  const initialState: SimpleUrlState = {
    url: "",
    error: undefined,
    shortUrl: undefined,
  };
  const [state, shortURLAction, isPending] = useActionState(
    createSimpleShortUrl,
    initialState
  );

  return (
    <section className="w-full max-w-4xl mx-auto space-y-2 animate-in fade-in-0 slide-in-from-bottom-4 duration-300">
      {/* Main form */}
      <form action={shortURLAction} className="flex flex-col md:flex-row gap-2">
        <Input
          translate="no"
          aria-label="Enter URL to shorten"
          placeholder="Paste your long URL here"
          name="url"
          defaultValue={state?.url ?? ""}
          className="flex-grow py-5 bg-gray-800 border-gray-700 text-white placeholder-gray-400 focus:ring-gray-400 focus:border-gray-400"
        />
        <Button
          type="submit"
          disabled={isPending}
          className={`bg-neon-pink/80 font-bold hover:bg-neon-pink/70 text-white py-5 min-w-[120px] relative overflow-hidden transition-all ${
            isPending ? "bg-neon-pink/80" : ""
          }`}
        >
          {isPending ? (
            <>
              <Loader2 size={16} className="animate-spin" />
              Shrinking...
              <div className="absolute inset-0 w-1/4 h-full bg-gradient-to-r from-transparent via-white/10 to-transparent animate-shimmer" />
            </>
          ) : (
            "Shrink It!"
          )}
        </Button>
      </form>

      {/* Fixed height container for results/errors */}
      <div className="min-h-[40px]">
        {/* Error state */}
        {state?.error && (
          <div className="py-2 px-3 bg-red-500/10 border border-red-500/50 rounded flex items-center gap-2 text-red-400 text-sm">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <p>{state.error}</p>
          </div>
        )}

        {/* Success state */}
        {state?.shortUrl && (
          <div className="px-3 bg-gray-700/50 backdrop-blur-sm border border-neon-pink/20 rounded flex items-center justify-between animate-in fade-in-0 duration-300">
            <div className="flex items-center gap-2 w-full">
              <p className="text-neon-pink break-all flex-grow" translate="no">
                {state.shortUrl}
              </p>
              <CopyButton textToCopy={state.shortUrl} />
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
