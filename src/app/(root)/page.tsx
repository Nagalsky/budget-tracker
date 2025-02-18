import prisma from "@/lib/prisma";
import { getSession } from "@/utils/get-session";
import { redirect } from "next/navigation";

export default async function HomePage() {
  const user = await getSession();

  const userSettings = await prisma.userSettings.findUnique({
    where: {
      userId: user.id,
    },
  });

  if (!userSettings) {
    redirect("/wizard");
  }

  return (
    <div className="container">
      <h1>fwfw</h1>
    </div>
  );
}
