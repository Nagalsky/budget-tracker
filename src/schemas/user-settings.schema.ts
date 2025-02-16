import { currencies } from "@/constants/currencies";
import { z } from "zod";

export const updateUserCurrencySchema = z.object({
  currency: z.custom((value) => {
    const found = currencies.some((c) => c.value === value);
    if (!found) {
      throw new Error(`invalid currency: ${value}`);
    }

    return value;
  }),
});
