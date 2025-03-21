import {
  getCategoriesStats,
  GetCategoriesStatsResponseType,
} from "@/actions/stats.action";
import { useQuery } from "@tanstack/react-query";

interface UseBalanceStatsProps {
  from: Date;
  to: Date;
}

export const useGetCategoriesStats = ({ from, to }: UseBalanceStatsProps) => {
  return useQuery<GetCategoriesStatsResponseType>({
    queryKey: ["overview", "stats", "categories", from, to],
    queryFn: () => getCategoriesStats({ from, to }),
  });
};
