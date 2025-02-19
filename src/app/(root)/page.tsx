import DashboardHero from "@/components/common/dashboard-hero";
import History from "@/components/common/history";
import Overview from "@/components/common/overview";
import prisma from "@/lib/prisma";
import { getUser } from "@/utils/get-user";
import { Metadata } from "next";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
  title: "Dashboard",
};

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
      <DashboardHero user={user} />
      <Overview userSettings={userSettings} />
      <History userSettings={userSettings} />
    </>
  );
}
