"use server";

import { auth } from "@/auth";
import { redirect } from "next/navigation";

export async function getSession() {
  const session = await auth();

  if (!session?.user) {
    redirect("/sign-in");
  }

  const user = session.user;

  return user;
}
