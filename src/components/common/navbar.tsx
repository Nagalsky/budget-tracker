"use client";
import { cn } from "@/lib/utils";
import { MenuIcon } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { FC, useState } from "react";
import { Button } from "../ui/button";
import { Separator } from "../ui/separator";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetTitle,
  SheetTrigger,
} from "../ui/sheet";
import ModeToggle from "./mode-toggle";

const navItems = [
  {
    title: "Dashboard",
    href: "/",
  },
  {
    title: "Transaction",
    href: "/transaction",
  },
  {
    title: "Manage",
    href: "/manage",
  },
];

const Navbar: FC = () => {
  const [isMenuOpened, setIsMenuOpened] = useState<boolean>(false);
  const pathname = usePathname();
  return (
    <div className="ml-auto flex flex-col md:flex-row md:items-center">
      <nav className="hidden md:flex md:flex-row">
        {navItems.map((item, index) => {
          const isActive = pathname === item.href;
          return (
            <Link
              href={item.href}
              key={index}
              className={cn(
                "relative px-4 font-medium transition-colors hover:text-blue-400",
                isActive &&
                  "text-blue-400 before:absolute before:bottom-0 before:left-0 before:h-0.5 before:w-full before:translate-y-[28px] before:rounded before:bg-blue-400",
              )}
            >
              {item.title}
            </Link>
          );
        })}
      </nav>
      <Separator orientation="vertical" className="mx-6 hidden h-5 md:block" />
      <div className="hidden md:block">
        <ModeToggle />
      </div>
      <Sheet open={isMenuOpened} onOpenChange={setIsMenuOpened}>
        <SheetTrigger asChild>
          <Button variant="outline" size="icon" className="md:hidden">
            <MenuIcon className="h-6 w-6" />
            <span className="sr-only">Toggle navigation menu</span>
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="px-6">
          <SheetTitle />
          <SheetDescription />
          <nav className="flex flex-col gap-y-8">
            {navItems.map((item, index) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  href={item.href}
                  key={index}
                  onClick={() => setIsMenuOpened(false)}
                  className={cn(
                    "transition-colors hover:text-blue-400",
                    isActive && "font-bold text-blue-400",
                  )}
                >
                  {item.title}
                </Link>
              );
            })}
          </nav>
          <Separator className="my-6" />
          <div className="flex items-center justify-between gap-3 md:hidden">
            <p>Switch Theme</p>
            <ModeToggle />
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
};

export default Navbar;
