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
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import Link from "next/link";
import { redirect } from "next/navigation";

export default async function Wizard() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user) {
    redirect("/sign-in");
  }

  return (
    <section className="w-full py-8 md:py-12">
      <div className="container lg:max-w-3xl">
        <div className="space-y-5 text-center">
          <h1 className="text-center text-3xl md:text-5xl">
            Welcome, <span className="ml-2 font-bold">{session.user.name}</span>{" "}
            👋🏽
          </h1>
          <h2 className="text-muted-foreground text-center text-lg">
            Let&apos;s get started by setting up your currency.
          </h2>
          <h3 className="text-muted-foreground text-center text-lg">
            You can change these setting at any time.
          </h3>
        </div>
        <Separator className="my-4" />
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
