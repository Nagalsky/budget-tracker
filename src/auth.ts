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
    // async jwt({ token }) {
    //   if (!token.sub) return token;
    //   const existinUser = await getUserByUserId(token.sub);
    //   if (!existinUser) return token;
    //   const existingAccount = await getAccountByUserId(existinUser.id);
    //   token.isOauth = !!existingAccount;
    //   token.name = existinUser.name;
    //   token.email = existinUser.email;
    //   token.image = existinUser.image;
    //   return token;
    // },
    // async signIn({ user, account }) {
    //   if (account?.provider === "google") {
    //     const existingUser = await prisma.user.findUnique({
    //       where: { email: user.email! },
    //     });

    //     if (!existingUser) {
    //       // Create new user without password for OAuth
    //       await prisma.user.create({
    //         data: {
    //           email: user.email!,
    //           name: user.name,
    //           image: user.image,
    //         },
    //       });
    //     }
    //   }
    //   return true;
    // },
    async session({ token, session }) {
      return {
        ...session,
        user: {
          ...session.user,
          id: token.sub,
          isOauth: token.isOauth,
        },
      };
    },
  },
  trustHost: true,
});
