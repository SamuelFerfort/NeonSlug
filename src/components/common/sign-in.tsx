import Link from "next/link";

export default function SignInButton() {
  return (
    <Link href={"/auth/signin"}>
      <button type="submit">Sign in</button>
    </Link>
  );
}
