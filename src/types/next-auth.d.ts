import { DefaultSession, User } from "next-auth";
import "next-auth/jwt";

export interface AuthUser extends User {
  id: string;
  name: string;
  email: string;
  image: string;
}

declare module "next-auth" {
  interface Session {
    user?: AuthUser & DefaultSession["user"];
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    user?: AuthUser;
  }
}
