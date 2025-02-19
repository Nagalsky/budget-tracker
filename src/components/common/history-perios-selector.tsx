import { GetHistoryPeriosResponseType } from "@/actions/history-periods.action";
import { useHistoryPeriods } from "@/hooks/use-get-history-periods";
import { Period, Timeframe } from "@/types/timeframe.type";
import { FC } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Tabs, TabsList, TabsTrigger } from "../ui/tabs";
import SkeletonWrapper from "./skeleton-wrapper";

type Props = {
  period: Period;
  setPeriod: (period: Period) => void;
  timeframe: Timeframe;
  setTimeFrame: (timeframe: Timeframe) => void;
};

const HistoryPeriosSelector: FC<Props> = ({
  period,
  setPeriod,
  timeframe,
  setTimeFrame,
}) => {
  const { data, isFetching } = useHistoryPeriods();

  return (
    <div className="flex flex-wrap items-center gap-4">
      <SkeletonWrapper isLoading={isFetching} fullWidth={false}>
        <Tabs
          value={timeframe}
          onValueChange={(value) => setTimeFrame(value as Timeframe)}
        >
          <TabsList>
            <TabsTrigger value="year" className="cursor-pointer">
              Year
            </TabsTrigger>
            <TabsTrigger value="month" className="cursor-pointer">
              Month
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </SkeletonWrapper>
      <div className="flex flex-wrap gap-2">
        <SkeletonWrapper isLoading={isFetching} fullWidth={false}>
          <YearSelector
            period={period}
            setPeriod={setPeriod}
            years={data || []}
          />
        </SkeletonWrapper>
        {timeframe === "month" && (
          <SkeletonWrapper isLoading={isFetching} fullWidth={false}>
            <MonthSelector period={period} setPeriod={setPeriod} />
          </SkeletonWrapper>
        )}
      </div>
    </div>
  );
};

export default HistoryPeriosSelector;

function YearSelector({
  period,
  setPeriod,
  years,
}: {
  period: Period;
  setPeriod: (period: Period) => void;
  years: GetHistoryPeriosResponseType;
}) {
  return (
    <Select
      value={period.year.toString()}
      onValueChange={(value) =>
        setPeriod({
          month: period.month,
          year: parseInt(value),
        })
      }
    >
      <SelectTrigger className="w-[180px]">
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        {years.map((year) => (
          <SelectItem key={year} value={year.toString()}>
            {year}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}

function MonthSelector({
  period,
  setPeriod,
}: {
  period: Period;
  setPeriod: (period: Period) => void;
}) {
  return (
    <Select
      value={period.month.toString()}
      onValueChange={(value) =>
        setPeriod({
          month: parseInt(value),
          year: period.year,
        })
      }
    >
      <SelectTrigger className="w-[180px]">
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        {Array.from({ length: 12 }, (_, month) => {
          const monthName = new Date(period.year, month, 1).toLocaleString(
            "default",
            {
              month: "long",
            },
          );
          return (
            <SelectItem key={month} value={month.toString()}>
              {monthName}
            </SelectItem>
          );
        })}
      </SelectContent>
    </Select>
  );
}
