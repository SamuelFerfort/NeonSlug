import NextAuth from "next-auth";
import { PrismaAdapter } from "@auth/prisma-adapter"
import Google from "next-auth/providers/google";
import { prisma } from "@/src/lib/prisma";

export const { handlers, signIn, signOut, auth } = NextAuth({
  adapter: PrismaAdapter(prisma),
  providers: [Google({
    clientId: process.env.GOOGLE_CLIENT_ID!,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
  })],
  callbacks: {
    session: ({ session, user }) => ({
      ...session,
      user: {
        ...session.user,
        id: user.id,
      },
    }),
  },
  secret: process.env.AUTH_SECRET,
});