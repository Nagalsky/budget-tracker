import { PrismaAdapter } from "@auth/prisma-adapter";
import NextAuth from "next-auth";
import authConfig from "./lib/auth.config";
import prisma from "./lib/prisma";
import { UserRole } from "./types/next-auth";

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
    async jwt({ token }) {
      if (!token.role && token.email) {
        const dbUser = await prisma.user.findUnique({
          where: { email: token.email },
          select: { role: true, id: true },
        });

        if (dbUser) {
          token.role = dbUser.role as UserRole;
          token.id = dbUser.id;
        }
      }

      return token;
    },
    async session({ token, session }) {
      if (token) {
        session.user.id = token.id;
        session.user.role = token.role;
      }
      return session;
    },
  },
  trustHost: true,
});
