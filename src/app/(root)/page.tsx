import DashboardActions from "@/components/common/dashboard-actions";
import History from "@/components/common/history";
import Overview from "@/components/common/overview";
import prisma from "@/lib/prisma";
import { getUser } from "@/utils/get-user";
import { redirect } from "next/navigation";

export default async function HomePage() {
  const user = await getUser();

  const userSettings = await prisma.userSettings.findUnique({
    where: {
      userId: user.id,
    },
  });

  if (!userSettings) {
    redirect("/wizard");
  }

  return (
    <>
      <DashboardActions user={user} />
      <Overview userSettings={userSettings} />
      <History userSettings={userSettings} />
    </>
  );
}
