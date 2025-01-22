import { LoginForm } from "@/src/components/ui/login-form";
import { auth } from "@/src/auth";
import { redirect } from "next/navigation";

export default async function LoginPage() {
  const session = await auth();

  if (session) {
    redirect("/dashboard");
  }

  return (
    <div className="overflow-hidden flex flex-col items-center p-6 md:p-10 z-50">
      <div className="flex w-full max-w-md flex-col pt-28 gap-6  ">
        <LoginForm />
      </div>
    </div>
  );
}
