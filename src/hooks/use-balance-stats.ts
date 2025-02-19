import {
  getBalance,
  GetBalanceStatsResponseType,
} from "@/actions/stats.action";
import { useQuery } from "@tanstack/react-query";

interface UseBalanceStatsProps {
  from: Date;
  to: Date;
}

export const useBalanceStats = ({ from, to }: UseBalanceStatsProps) => {
  return useQuery<GetBalanceStatsResponseType>({
    queryKey: ["overview", "stats", from, to],
    queryFn: () => getBalance({ from, to }),
  });
};
