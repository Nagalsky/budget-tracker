import { auth } from "@/auth";
import { redirect } from "next/navigation";

export async function getUser() {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return redirect("/sign-in");
    }

    return session.user;
  } catch {
    return redirect("/sign-in?error=session");
  }
}
