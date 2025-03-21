"use client";
import TransactionsHero from "@/components/common/transactions-hero";
import TransactionsTable from "@/components/common/transactions-table";
import { startOfMonth } from "date-fns";
import { useState } from "react";

export default function TransactionsContainer() {
  const [dateRange, setDateRange] = useState<{ from: Date; to: Date }>({
    from: startOfMonth(new Date()),
    to: new Date(),
  });

  return (
    <>
      <TransactionsHero dateRange={dateRange} setDateRange={setDateRange} />
      <TransactionsTable from={dateRange.from} to={dateRange.to} />
    </>
  );
}
