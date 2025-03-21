import { CurrencyComboBox } from "@/components/common/currency-combo-box";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { getUser } from "@/utils/get-user";
import { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Wizard",
};

export default async function Wizard() {
  const user = await getUser();

  return (
    <section className="w-full py-8 md:py-12">
      <div className="container lg:max-w-3xl">
        <div className="mb-5 space-y-5 text-center">
          <h1 className="text-center text-3xl md:text-4xl">
            Welcome, <span className="ml-2 font-bold">{user.name}</span> 👋🏽
          </h1>
          <h2 className="text-muted-foreground text-center text-lg">
            Let&apos;s get started by setting up your currency.
          </h2>
          <h3 className="text-muted-foreground text-center text-lg">
            You can change these setting at any time.
          </h3>
        </div>
        <Card>
          <CardHeader>
            <CardTitle>Currency</CardTitle>
            <CardDescription>
              Set your default currency for transactions
            </CardDescription>
          </CardHeader>
          <CardContent>
            <CurrencyComboBox />
          </CardContent>
        </Card>
        <Separator className="my-4" />
        <Button className="w-full" size={"lg"} asChild>
          <Link href={"/"}>I&apos;m done! Take me to the dashboard</Link>
        </Button>
      </div>
    </section>
  );
}
