import {
  getHistoryPeriods,
  GetHistoryPeriosResponseType,
} from "@/actions/history-periods.action";
import { useQuery } from "@tanstack/react-query";

export const useHistoryPeriods = () => {
  return useQuery<GetHistoryPeriosResponseType>({
    queryKey: ["overview", "history", "periods"],
    queryFn: getHistoryPeriods,
  });
};
