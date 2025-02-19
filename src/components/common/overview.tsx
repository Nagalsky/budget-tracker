"use client";
import { MAX_DATE_RANGE_DAYS } from "@/constants/date-range";
import { UserSettings } from "@prisma/client";
import { differenceInDays, startOfMonth } from "date-fns";
import { FC, useState } from "react";
import { toast } from "sonner";
import { DateRangePicker } from "../ui/date-range-picker";
import CategoriesStats from "./categories-stats";
import StatsCards from "./stats-cards";

type Props = {
  userSettings: UserSettings;
};

const Overview: FC<Props> = ({ userSettings }) => {
  const [dateRange, setDateRange] = useState<{ from: Date; to: Date }>({
    from: startOfMonth(new Date()),
    to: new Date(),
  });

  return (
    <section className="py-6">
      <div className="container">
        <div className="mb-5 flex flex-wrap items-end justify-between gap-2">
          <h2 className="text-3xl font-bold">Overview</h2>
          <DateRangePicker
            initialDateFrom={dateRange.from}
            initialDateTo={dateRange.to}
            showCompare={false}
            onUpdate={(values) => {
              const { from, to } = values.range;

              if (!from || !to) return;
              if (differenceInDays(to, from) > MAX_DATE_RANGE_DAYS) {
                toast.error(
                  `The selected date range is to big. Max allowed range is ${MAX_DATE_RANGE_DAYS} days!`,
                );
                return;
              }

              setDateRange({ from, to });
            }}
          />
        </div>
        <div className="flex flex-col gap-4">
          <StatsCards
            userSettings={userSettings}
            from={dateRange.from}
            to={dateRange.to}
          />

          <CategoriesStats
            userSettings={userSettings}
            from={dateRange.from}
            to={dateRange.to}
          />
        </div>
      </div>
    </section>
  );
};

export default Overview;
