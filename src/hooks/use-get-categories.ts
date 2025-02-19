import { getCategories } from "@/actions/categories.actions";
import { TransactionType } from "@/types/transaction.type";
import { Category } from "@prisma/client";
import { useQuery } from "@tanstack/react-query";

export function useGetCategories(type: TransactionType) {
  const { data, isFetching, isError, error, refetch } = useQuery<Category[]>({
    queryKey: ["categories", type],
    queryFn: () => getCategories(type),
  });

  return {
    data,
    isFetching,
    isError,
    error,
    refetch,
  };
}
