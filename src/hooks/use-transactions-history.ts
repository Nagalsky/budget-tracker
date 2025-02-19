import {
  GetTransactionHistoryResponseType,
  getTransactions,
} from "@/actions/transactions.actions";
import { dateToUTCDate } from "@/lib/date-to-utc-date";
import { useQuery } from "@tanstack/react-query";

export const useTransactionsHistory = ({
  from,
  to,
}: {
  from: Date;
  to: Date;
}) => {
  return useQuery<GetTransactionHistoryResponseType>({
    queryKey: ["transactions", "history", from, to],
    queryFn: () =>
      getTransactions({ from: dateToUTCDate(from), to: dateToUTCDate(to) }),
  });
};
