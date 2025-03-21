"use client";
import { MAX_DATE_RANGE_DAYS } from "@/constants/date-range";
import { differenceInDays } from "date-fns";
import { FC } from "react";
import { toast } from "sonner";
import { DateRangePicker } from "../ui/date-range-picker";

type Props = {
  dateRange: { from: Date; to: Date };
  setDateRange: (dateRange: { from: Date; to: Date }) => void;
};

const TransactionsHero: FC<Props> = ({ dateRange, setDateRange }) => {
  return (
    <section className="bg-secondary border-b py-8">
      <div className="container">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h1 className="text-3xl font-bold">Transactions history</h1>

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
      </div>
    </section>
  );
};

export default TransactionsHero;
