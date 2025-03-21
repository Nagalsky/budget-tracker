import { getUserCurrency } from "@/actions/user-settings.actions";
import { UserSettings } from "@prisma/client";
import { useQuery } from "@tanstack/react-query";

export function useGetCurrency() {
  return useQuery<UserSettings>({
    queryKey: ["user-settings"],
    queryFn: () => getUserCurrency(),
  });
}
