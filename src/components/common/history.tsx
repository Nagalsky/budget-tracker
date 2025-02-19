"use client";
import { useHistory } from "@/hooks/use-get-history";
import { formatterCurrency } from "@/lib/formatter-currency";
import { cn } from "@/lib/utils";
import { Period, Timeframe } from "@/types/timeframe.type";
import { UserSettings } from "@prisma/client";
import { useTheme } from "next-themes";
import { FC, useCallback, useMemo, useState } from "react";
import CountUp from "react-countup";
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { Badge } from "../ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import HistoryPeriosSelector from "./history-perios-selector";
import SkeletonWrapper from "./skeleton-wrapper";

type Props = {
  userSettings: UserSettings;
};

const History: FC<Props> = ({ userSettings }) => {
  const theme = useTheme();
  const [timeframe, setTimeFrame] = useState<Timeframe>("month");
  const [period, setPeriod] = useState<Period>({
    month: new Date().getMonth(),
    year: new Date().getFullYear(),
  });

  const formatter = useMemo(() => {
    return formatterCurrency(userSettings.currency);
  }, [userSettings.currency]);

  const { data: historyData, isLoading } = useHistory({
    month: period.month,
    year: period.year,
    timeframe,
  });

  const dataAvailable = historyData && historyData.length > 0;

  return (
    <section className="py-6">
      <div className="container">
        <h2 className="mb-5 text-3xl font-bold">History</h2>
        <Card>
          <CardHeader className="gap-2">
            <CardTitle className="text-muted-foreground flex flex-wrap items-center justify-between gap-3 text-xl">
              <HistoryPeriosSelector
                period={period}
                setPeriod={setPeriod}
                timeframe={timeframe}
                setTimeFrame={setTimeFrame}
              />
              <div className="flex h-10 gap-2">
                <Badge variant={"outline"} className="gap-3 text-sm">
                  <div className="size-3 rounded-full bg-emerald-500"></div>
                  Income
                </Badge>
                <Badge variant={"outline"} className="gap-3 text-sm">
                  <div className="size-3 rounded-full bg-rose-500"></div>
                  Expense
                </Badge>
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <SkeletonWrapper isLoading={isLoading}>
              {dataAvailable ? (
                <ResponsiveContainer width={"100%"} height={300}>
                  <BarChart height={300} data={historyData} barCategoryGap={5}>
                    <defs>
                      <linearGradient
                        id="incomeBar"
                        x1="0"
                        y1="0"
                        x2="0"
                        y2="1"
                      >
                        <stop
                          offset={"0"}
                          stopColor={"#10b981"}
                          stopOpacity={"1"}
                        />
                        <stop
                          offset={"1"}
                          stopColor={"#10b981"}
                          stopOpacity={"0"}
                        />
                      </linearGradient>
                      <linearGradient
                        id="expenseBar"
                        x1="0"
                        y1="0"
                        x2="0"
                        y2="1"
                      >
                        <stop
                          offset={"0"}
                          stopColor={"#ef4444"}
                          stopOpacity={"1"}
                        />
                        <stop
                          offset={"1"}
                          stopColor={"#ef4444"}
                          stopOpacity={"0"}
                        />
                      </linearGradient>
                    </defs>
                    <CartesianGrid
                      strokeDasharray={"5 5"}
                      strokeOpacity={"0.2"}
                      stroke={
                        theme.resolvedTheme === "light" ? "black" : "gray"
                      }
                      vertical={false}
                    />
                    <XAxis
                      stroke="#888888"
                      fontSize={12}
                      tickLine={false}
                      axisLine={false}
                      padding={{ left: 5, right: 5 }}
                      dataKey={(data) => {
                        const { year, month, day } = data;
                        const date = new Date(year, month, day || 1);
                        if (timeframe === "year") {
                          return date.toLocaleDateString("default", {
                            month: "long",
                          });
                        }
                        return date.toLocaleDateString("default", {
                          day: "2-digit",
                        });
                      }}
                    />
                    <YAxis
                      stroke="#888888"
                      fontSize={12}
                      tickLine={false}
                      axisLine={false}
                    />
                    <Bar
                      dataKey={"income"}
                      label="Income"
                      fill={"url(#incomeBar)"}
                      radius={4}
                      className="cursor-pointer"
                    />
                    <Bar
                      dataKey={"expense"}
                      label="Expense"
                      fill={"url(#expenseBar)"}
                      radius={4}
                      className="cursor-pointer"
                    />
                    <Tooltip
                      cursor={{ opacity: 0.1 }}
                      content={(props) => (
                        <CustomTooltip formatter={formatter} {...props} />
                      )}
                    />
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <Card className="bg-background flex h-[300px] flex-col items-center justify-center">
                  <p>No data fir the selected period</p>
                  <p className="text-sn text-muted-foreground">
                    Try selecting a different period or adding new transaction
                  </p>
                </Card>
              )}
            </SkeletonWrapper>
          </CardContent>
        </Card>
      </div>
    </section>
  );
};

export default History;

function CustomTooltip({
  active = false,
  payload,
  formatter,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
}: any) {
  if (!active || !payload || payload.length === 0) return null;

  const data = payload[0]?.payload;
  const { expense, income } = data;
  return (
    <div className="bg-background min-w-[300px] rounded border p-4">
      <TooltipRow
        formatter={formatter}
        label="Expense"
        value={expense}
        bgColor={"bg-red-500"}
        textColor={"text-red-500"}
      />
      <TooltipRow
        formatter={formatter}
        label="Income"
        value={income}
        bgColor={"bg-emerald-500"}
        textColor={"text-emerald-500"}
      />
      <TooltipRow
        formatter={formatter}
        label="Balance"
        value={income - expense}
        bgColor={"bg-gray-100"}
        textColor={"text-foreground"}
      />
    </div>
  );
}
function TooltipRow({
  label,
  value,
  bgColor,
  textColor,
  formatter,
}: {
  formatter: Intl.NumberFormat;
  label: string;
  value: number;
  bgColor: string;
  textColor: string;
}) {
  const formattingFn = useCallback(
    (value: number) => {
      return formatter.format(value);
    },
    [formatter],
  );
  return (
    <div className="flex items-center gap-2">
      <div className={cn("size-4 rounded-full", bgColor)} />
      <div className="flex w-full justify-between">
        <p className="text-muted-foreground text-sm">{label}</p>
        <div className={cn("font-bokd text-sm", textColor)}>
          <CountUp
            duration={0.5}
            preserveValue
            end={value}
            decimals={0}
            formattingFn={formattingFn}
            className="text-sm"
          />
        </div>
      </div>
    </div>
  );
}
