import { updateUserCurrency } from "@/actions/user-settings.actions";
import { Currency } from "@/constants/currencies";
import { UserSettings } from "@prisma/client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

export const useUpdateCurrency = (
  currencies: Currency[],
  setSelectedOption: (currency: Currency | null) => void,
) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateUserCurrency,
    onSuccess: (data: UserSettings) => {
      toast.success(`Currency updated successfully 🎉`, {
        id: "update-currency",
      });

      queryClient.invalidateQueries({
        queryKey: ["user-settings"],
      });

      setSelectedOption(
        currencies.find((c) => c.value === data.currency) || null,
      );
    },
    onError: () => {
      toast.error("Something went wrong", {
        id: "update-currency",
      });
    },
  });
};
