"use client";

import { verifyPassword } from "@/src/lib/actions";
import { useActionState, use, useState } from "react";
import { VerifyPasswordState } from "@/src/lib/types";
import { Input } from "@/src/components/ui/input";
import { Card, CardHeader, CardContent } from "@/src/components/ui/card";
import { Lock, Eye, EyeOff } from "lucide-react";

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
    initialState,
  );

  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="flex  justify-center mt-36 px-4">
      <Card className="max-w-md w-full space-y-2 bg-gray-900 z-50">
        <CardHeader className="space-y-4 text-center">
          <div className="mx-auto w-12 h-12 bg-neon-pink/10 rounded-full flex items-center justify-center">
            <Lock size={28} color="#ff00ff" />
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

            <div className="space-y-2 relative">
              <label
                htmlFor="password"
                className="text-sm font-medium text-gray-200"
              >
                Password
              </label>
              <div className="relative">
                <Input
                  id="password"
                  name="password"
                  disabled={isPending}
                  type={showPassword ? "text" : "password"}
                  defaultValue={state?.password || ""}
                  className="w-full text-white bg-gray-800/50 border-gray-700 focus:ring-gray-400 focus:border-gray-400 placeholder-gray-500 pr-10"
                  placeholder="Enter your password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-200"
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5" />
                  ) : (
                    <Eye className="h-5 w-5" />
                  )}
                </button>
              </div>
            </div>

            {state.error && (
              <div className="text-sm text-red-400 bg-red-900/10 border border-red-900/50 rounded-md p-3">
                {state.error}
              </div>
            )}

            <button
              type="submit"
              disabled={isPending}
              className={`w-full py-2.5 font-bold px-4 text-sm rounded-md text-white bg-neon-pink/80 hover:bg-neon-pink/70 focus:outline-none focus:ring-2 focus:ring-neon-pink focus:ring-offset-2 focus:ring-offset-gray-900 disabled:opacity-50 disabled:cursor-not-allowed transition-colors relative overflow-hidden ${
                isPending ? "bg-neon-pink/70" : ""
              }`}
            >
              {isPending ? (
                <>
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
                  <div className="absolute inset-0 w-1/4 h-full bg-gradient-to-r from-transparent via-white/10 to-transparent animate-shimmer" />
                </>
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
