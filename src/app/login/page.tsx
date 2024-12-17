import { LoginForm } from "@/src/components/ui/login-form";
import { auth } from "@/src/auth";
import { redirect } from "next/navigation";

export default async function LoginPage() {
  const session = await auth();

  if (session) {
    redirect("/dashboard");
  }

  return (
    <div className="flex min-h-svh flex-col items-center  gap-6  p-6 md:p-10">
      <div className="flex w-full max-w-md flex-col pt-28 gap-6">
        <LoginForm />
      </div>
    </div>
  );
}
