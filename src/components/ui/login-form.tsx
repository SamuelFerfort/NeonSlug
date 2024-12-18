import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/src/components/ui/card";
import Google from "../icons/google";
import Github from "../icons/github";
import LoginButton from "../common/login-button";
import { googleLogin, githubLogin } from "@/src/lib/actions";
import { cn } from "@/src/lib/utils";

export function LoginForm({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"div">) {
  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card className="bg-gray-900 border-gray-800 z-50 slide-in-from-bottom-5 animate-in fade-in-0 duration-300">
        <CardHeader className="text-center">
          <CardTitle className="text-white text-4xl tracking-tight">
            Welcome back
          </CardTitle>
          <CardDescription className="text-gray-400">
            Login with your Google or Github account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-4">
            <form action={googleLogin}>
              <LoginButton icon={<Google />} provider="Google" />
            </form>
            <form action={githubLogin}>
              <LoginButton icon={<Github />} provider="Github" />
            </form>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
