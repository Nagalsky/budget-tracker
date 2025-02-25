import { PrismaAdapter } from "@auth/prisma-adapter";
import NextAuth from "next-auth";
import authConfig from "./lib/auth.config";
import prisma from "./lib/prisma";

export const {
  auth,
  handlers: { GET, POST },
  signIn,
  signOut,
} = NextAuth({
  adapter: PrismaAdapter(prisma),
  session: {
    strategy: "jwt",
  },
  ...authConfig,
  callbacks: {
    async session({ token, session }) {
      const dbUser = await prisma.user.findUnique({
        where: { email: session.user.email },
      });

      return {
        ...session,
        user: {
          ...session.user,
          id: token.sub,
          isOauth: token.isOauth,
          role: dbUser?.role,
        },
      };
    },
  },
  trustHost: true,
});
