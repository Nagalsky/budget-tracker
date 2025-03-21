import { GetCategoriesStatsResponseType } from "@/actions/stats.action";
import { useGetCategoriesStats } from "@/hooks/use-get-categories-stats";
import { dateToUTCDate } from "@/lib/date-to-utc-date";
import { formatterCurrency } from "@/lib/formatter-currency";
import { TransactionType } from "@/types/transaction.type";
import { UserSettings } from "@prisma/client";
import { FC, useMemo } from "react";
import { Card, CardHeader, CardTitle } from "../ui/card";
import { Progress } from "../ui/progress";
import { ScrollArea } from "../ui/scroll-area";
import SkeletonWrapper from "./skeleton-wrapper";

type Props = {
  userSettings: UserSettings;
  from: Date;
  to: Date;
};

const CategoriesStats: FC<Props> = ({ userSettings, from, to }) => {
  const { data, isFetching } = useGetCategoriesStats({
    from: dateToUTCDate(from),
    to: dateToUTCDate(to),
  });

  const formatter = useMemo(() => {
    return formatterCurrency(userSettings.currency);
  }, [userSettings]);

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
      <SkeletonWrapper isLoading={isFetching}>
        <CategoriesCard formatter={formatter} type="income" data={data || []} />
      </SkeletonWrapper>
      <SkeletonWrapper isLoading={isFetching}>
        <CategoriesCard
          formatter={formatter}
          type="expense"
          data={data || []}
        />
      </SkeletonWrapper>
    </div>
  );
};

export default CategoriesStats;

function CategoriesCard({
  formatter,
  type,
  data,
}: {
  formatter: Intl.NumberFormat;
  type: TransactionType;
  data: GetCategoriesStatsResponseType;
}) {
  const filteredData = data.filter((el) => el.type === type);

  const total = filteredData.reduce(
    (acc, el) => acc + (el._sum?.amount || 0),
    0,
  );

  return (
    <Card className="h-80 w-full">
      <CardHeader>
        <CardTitle className="text-muted-foreground text-xl">
          {type === "income" ? "Incomes" : "Expenses"} by category
        </CardTitle>
      </CardHeader>
      <div className="flex items-center justify-between gap-2">
        {filteredData.length === 0 && (
          <div className="flex h-60 w-full flex-col items-center justify-center px-4 text-center">
            <p>No data for the selected data</p>
            <p className="text-muted-foreground text-sm">
              Try selecting different period or try adding new{" "}
              {type === "income" ? "incomes" : "expenses"}
            </p>
          </div>
        )}
        {filteredData.length > 0 && (
          <ScrollArea className="h-60 w-full px-2">
            <div className="flex flex-col gap-4 p-4">
              {filteredData.map((item) => {
                const amount = item._sum?.amount || 0;
                const percentage = (amount * 100) / (total || amount);
                return (
                  <div key={item.category} className="flex flex-col gap-1">
                    <div className="flex items-center justify-between gap-3">
                      <p className="flex items-center gap-3 text-gray-400">
                        <span>{item.categoryIcon}</span>
                        <span>{item.category}</span>
                        <span>({percentage.toFixed(0)}%)</span>
                      </p>
                      <span className="text-muted-foreground ml-2 text-sm">
                        {formatter.format(amount)}
                      </span>
                    </div>
                    <Progress
                      value={percentage}
                      indicator={
                        type === "income" ? "bg-emerald-500" : "bg-rose-600"
                      }
                    />
                  </div>
                );
              })}
            </div>
          </ScrollArea>
        )}
      </div>
    </Card>
  );
}
