"use client";

import { useActionState } from "react";
import { Input } from "@/src/components/ui/input";
import { Button } from "../ui/button";
import { createSimpleShortUrl } from "@/src/lib/actions";
import type { SimpleUrlState } from "@/src/lib/types";

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
    <section className="w-full max-w-4xl mx-auto">
      <form action={shortURLAction} className="flex flex-col md:flex-row gap-4">
        <Input
          placeholder="Paste your long URL here"
          name="url"
          defaultValue={state?.url ?? ""}
          className="flex-grow text-lg py-6 bg-gray-800 border-gray-700 text-white placeholder-gray-400 focus:ring-neon-pink focus:border-neon-pink"
        />
        <Button
          type="submit"
          size="lg"
          disabled={isPending}
          className="bg-neon-pink hover:bg-neon-pink/90 text-white text-lg py-6 px-8"
        >
          {isPending ? "Shrinking..." : "Shrink It!"}
        </Button>
      </form>

      {state?.error && <p className="mt-2 text-red-500">{state.error}</p>}

      {state?.shortUrl && (
        <div className="mt-6 p-4 bg-gray-800 rounded-md flex items-center justify-between">
          <p className="text-neon-pink text-lg break-all">{state.shortUrl}</p>
          <Button
            onClick={() =>
              state.shortUrl && navigator.clipboard.writeText(state.shortUrl)
            }
            variant="outline"
            className="ml-4 text-neon-pink border-neon-pink hover:bg-neon-pink hover:text-white"
          >
            Copy
          </Button>
        </div>
      )}
    </section>
  );
}
