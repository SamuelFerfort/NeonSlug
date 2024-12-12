import { auth, signIn, signOut } from "@/src/auth";
import Link from "next/link";

export default async function Home() {
  const session = await auth();

  return (
    <div className="p-10">
      {session ? (
        <div>
          <p>Signed in as {session.user?.email}</p>
          <img
            src={session.user?.image ?? ""}
            alt="Profile"
            className="w-12 h-12 rounded-full"
          />
          <form
            action={async () => {
              "use server";
              await signOut();
            }}
          >
            <button type="submit">Sign Out</button>
          </form>
        </div>
      ) : (
        <form
          action={async () => {
            "use server";
            await signIn("google");
          }}
        >
          <button type="submit">Sign In with Google</button>
        </form>
      )}
    </div>
  );
}
