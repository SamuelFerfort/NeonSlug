// app/auth/signin/page.tsx
import { auth, signIn } from "@/src/auth";
import { Button } from "@/src/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/src/components/ui/card";
import { LogIn, Mail } from "lucide-react";
import { redirect } from "next/navigation";


export default async function SignInPage() {
  const session = await auth();

  if (session) {
    redirect("/");
  }

  return (
    <div className="flex min-h-[60vh] items-center justify-center">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl text-center">Welcome back</CardTitle>
          <CardDescription className="text-center">
            Sign in to access your shortened URLs and analytics
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <form
            action={async () => {
              "use server";
              await signIn("google", {
                redirectTo: "/",
              });
            }}
          >
            <Button className="w-full" variant="outline">
              <Mail className="mr-2 h-4 w-4" />
              Continue with Google
            </Button>
          </form>

          <form
            action={async () => {
              "use server";
              await signIn("github", {
                redirectTo: "/dashboard",
              });
            }}
          >
            <Button className="w-full" variant="outline">
              <LogIn className="mr-2 h-4 w-4" />
              Continue with GitHub
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
