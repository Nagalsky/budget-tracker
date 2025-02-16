import { getUserCurrency } from "@/actions/user-settings.actions";
import { UserSettings } from "@prisma/client";
import { useQuery } from "@tanstack/react-query";

export function useGetUserCurrency() {
  const { data, isFetching, isError, error, refetch } = useQuery<UserSettings>({
    queryKey: ["user-settings"],
    queryFn: () => getUserCurrency(),
  });

  return {
    data,
    isFetching,
    isError,
    error,
    refetch,
  };
}
