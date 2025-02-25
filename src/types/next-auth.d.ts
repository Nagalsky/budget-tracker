import { DefaultSession, User } from "next-auth";
import "next-auth/jwt";

export enum UserRole {
  parent = "parent",
  child = "child",
}

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      name: string;
      email: string;
      image: string;
      role: UserRole;
    } & DefaultSession["user"];
  }
}

declare module "next-auth" {
  interface Session {
    user?: User & DefaultSession["user"];
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    role: UserRole;
  }
}
