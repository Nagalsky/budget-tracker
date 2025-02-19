"use client";
import { useBalanceStats } from "@/hooks/use-balance-stats";
import { formatterCurrency } from "@/lib/formatter-currency";
import { UserSettings } from "@prisma/client";
import { TrendingDown, TrendingUp, Wallet } from "lucide-react";
import { FC, useCallback, useMemo } from "react";
import CountUp from "react-countup";
import { Card } from "../ui/card";
import SkeletonWrapper from "./skeleton-wrapper";

type Props = {
  userSettings: UserSettings;
  from: Date;
  to: Date;
};

const StatsCards: FC<Props> = ({ userSettings, from, to }) => {
  const { data, isFetching } = useBalanceStats({ from, to });

  const formatter = useMemo(() => {
    return formatterCurrency(userSettings.currency);
  }, [userSettings.currency]);

  const income = data?.income || 0;
  const expense = data?.expense || 0;

  const balance = income - expense;

  return (
    <div className="grid grid-cols-3 gap-4">
      <SkeletonWrapper isLoading={isFetching}>
        <StatCard
          formatter={formatter}
          value={income}
          title="Income"
          icon={
            <TrendingUp className="size-12 items-center rounded-lg bg-emerald-400/10 p-2 text-emerald-500" />
          }
        />
      </SkeletonWrapper>
      <SkeletonWrapper isLoading={isFetching}>
        <StatCard
          formatter={formatter}
          value={expense}
          title="Expense"
          icon={
            <TrendingDown className="size-12 items-center rounded-lg bg-rose-400/10 p-2 text-rose-500" />
          }
        />
      </SkeletonWrapper>
      <SkeletonWrapper isLoading={isFetching}>
        <StatCard
          formatter={formatter}
          value={balance}
          title="Balance"
          icon={
            <Wallet className="size-12 items-center rounded-lg bg-violet-400/10 p-2 text-violet-500" />
          }
        />
      </SkeletonWrapper>
    </div>
  );
};

export default StatsCards;

function StatCard({
  formatter,
  value,
  title,
  icon,
}: {
  formatter: Intl.NumberFormat;
  value: number;
  title: string;
  icon: React.ReactNode;
}) {
  const formatFn = useCallback(
    (value: number) => {
      return formatter.format(value);
    },
    [formatter],
  );
  return (
    <Card className="flex flex-col items-center gap-2 p-4 sm:flex-row">
      <div className="shrink-0">{icon}</div>
      <div className="flex flex-col items-center sm:items-start">
        <p className="text-muted-foreground max-sm:text-sm">{title}</p>
        <CountUp
          preserveValue
          redraw={false}
          end={value}
          decimals={2}
          formattingFn={formatFn}
          className="text-lg font-bold sm:text-2xl"
        />
      </div>
    </Card>
  );
}
