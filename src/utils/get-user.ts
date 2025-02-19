"use server";

import { auth } from "@/auth";
import { AuthUser } from "@/types/next-auth";
import { redirect } from "next/navigation";

export async function getUser() {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return redirect("/sign-in");
    }

    const user = session.user as AuthUser;

    return user;
  } catch {
    return redirect("/sign-in?error=session");
  }
}
