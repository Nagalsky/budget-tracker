import { getHistoryData } from "@/actions/history-periods.action";
import { GetHistorySchemaType } from "@/schemas/history.schema";
import { useQuery } from "@tanstack/react-query";

export function useHistory(params: GetHistorySchemaType) {
  return useQuery({
    queryKey: [
      "overview",
      "history",
      params.timeframe,
      params.year,
      params.month,
    ],
    queryFn: () => getHistoryData(params),
  });
}
