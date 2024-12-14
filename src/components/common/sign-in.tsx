import { handleSignIn } from "@/src/lib/actions";

export default function SignIn() {
  return (
    <form action={handleSignIn}>
      <button type="submit">Sign in</button>
    </form>
  );
}
