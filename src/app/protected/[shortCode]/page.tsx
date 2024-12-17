"use client";

import { verifyPassword } from "@/src/lib/actions";
import { useActionState, use } from "react";
import { VerifyPasswordState } from "@/src/lib/types";
import { Input } from "@/src/components/ui/input";
import { Card, CardHeader, CardContent } from "@/src/components/ui/card";
import { Lock } from "lucide-react";

export default function PasswordProtectionPage({
  params,
}: {
  params: Promise<{ shortCode: string }>;
}) {
  const { shortCode } = use(params);
  const initialState: VerifyPasswordState | null = {
    password: "",
    shortCode,
  };

  const [state, verifyPasswordAction, isPending] = useActionState(
    verifyPassword,
    initialState
  );

  return (
    <div className="flex  justify-center mt-36 px-4">
      <Card className="max-w-md w-full space-y-2 bg-gray-900 z-50">
        <CardHeader className="space-y-4 text-center">
          <div className="mx-auto w-12 h-12 bg-pink-500/10 rounded-full flex items-center justify-center">
            <Lock className="w-6 h-6 text-pink-500" />
          </div>
          <h2 className="text-2xl font-bold tracking-tight text-white">
            Password Protected Link
          </h2>
          <p className="text-sm text-gray-400">
            Please enter the password to access this content
          </p>
        </CardHeader>

        <CardContent>
          <form action={verifyPasswordAction} className="space-y-4">
            <input type="hidden" name="shortCode" value={shortCode} />

            <div className="space-y-2">
              <label
                htmlFor="password"
                className="text-sm font-medium text-gray-200"
              >
                Password
              </label>
              <Input
                id="password"
                name="password"
                type="password"
                className="w-full text-white bg-gray-800/50 border-gray-700 focus:border-pink-500 focus:ring-pink-500/20 placeholder-gray-500"
                placeholder="Enter your password"
              />
            </div>

            {state.error && (
              <div className="text-sm text-red-400 bg-red-900/10 border border-red-900/50 rounded-md p-3">
                {state.error}
              </div>
            )}

            <button
              type="submit"
              disabled={isPending}
              className="w-full py-2.5 px-4 text-sm font-medium rounded-md text-white bg-pink-600 hover:bg-pink-500 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:ring-offset-2 focus:ring-offset-gray-900 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {isPending ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                      fill="none"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    />
                  </svg>
                  Verifying...
                </span>
              ) : (
                "Verify Password"
              )}
            </button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
