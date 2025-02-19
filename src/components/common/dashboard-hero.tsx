import { AuthUser } from "@/types/next-auth";
import { FC } from "react";
import { Button } from "../ui/button";
import CreateTransactionDialog from "./dialogs/create-transaction-dialog";

type Props = {
  user: AuthUser;
};

const DashboardHero: FC<Props> = ({ user }) => {
  return (
    <section className="bg-accent py-8">
      <div className="container">
        <div className="flex flex-wrap justify-between gap-6">
          <h1 className="text-3xl font-bold">Hello, {user.name}! 👋🏽</h1>
          <div className="flex items-center gap-3">
            <CreateTransactionDialog
              trigger={
                <Button
                  variant={"outline"}
                  className="border-emerald-300 bg-emerald-600 text-white hover:bg-emerald-700 hover:text-white dark:border-emerald-500 dark:bg-emerald-950 dark:hover:bg-emerald-700"
                >
                  New income 🤑
                </Button>
              }
              type="income"
            />
            <CreateTransactionDialog
              trigger={
                <Button
                  variant={"outline"}
                  className="border-rose-300 bg-rose-600 text-white hover:bg-rose-700 hover:text-white dark:border-rose-500 dark:bg-rose-950 dark:hover:bg-rose-700"
                >
                  New expense 😫
                </Button>
              }
              type="expense"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default DashboardHero;
