import { cn } from "@/src/lib/utils";
import { Button } from "@/src/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/src/components/ui/card";
import Google from "../icons/google";
import Github from "../icons/github";
import { signIn } from "@/src/auth";

export function LoginForm({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"div">) {
  return (
    <div className={cn("flex flex-col gap-6 ", className)} {...props}>
      <Card className="bg-gray-900 border-gray-800 z-50 slide-in-from-bottom-5 animate-in fade-in-0 duration-300">
        <CardHeader className="text-center">
          <CardTitle className=" text-white text-4xl tracking-tight">
            Welcome back
          </CardTitle>
          <CardDescription className="text-gray-400">
            Login with your Google or Github account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-4">
            <form>
              <Button
                className="w-full  text-white hover:bg-neon-pink/10 transition-colors"
                formAction={async () => {
                  "use server";
                  await signIn("google", {
                    redirectTo: "/dashboard",
                  });
                }}
              >
                <Google className="mr-2 h-4 w-4" />
                Login with Google
              </Button>
            </form>
            <form>
              <Button
                className="w-full  text-white hover:bg-neon-pink/10 transition-colors"
                formAction={async () => {
                  "use server";
                  await signIn("github", {
                    redirectTo: "/dashboard",
                  });
                }}
              >
                <Github className="mr-2 h-4 w-4" />
                Login with Github
              </Button>
            </form>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
