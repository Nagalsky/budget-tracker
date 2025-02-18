import { getSession } from "@/utils/get-session";
import Image from "next/image";
import Link from "next/link";
import { FC } from "react";
import Navbar from "./navbar";
import UserDropdown from "./user-dropdown";

export const Header: FC = async () => {
  const user = await getSession();

  return (
    <header className="bg-gray/50 shadow-accent-foreground/10 sticky top-0 z-30 py-4 shadow backdrop-blur-xl dark:shadow-white/10">
      <div className="container flex flex-wrap items-center gap-4">
        <Link href={"/"}>
          <Image
            src="/logo.svg"
            alt="Budget tracker logo"
            width={100}
            height={100}
            priority
            className="h-auto w-12"
          />
        </Link>
        <Navbar />
        <UserDropdown user={user} />
      </div>
    </header>
  );
};
