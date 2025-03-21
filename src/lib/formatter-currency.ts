import { CURRENCIES } from "@/constants/currencies";

export function formatterCurrency(currency: string) {
  const locale = CURRENCIES.find((c) => c.value === currency)?.locale;

  return new Intl.NumberFormat(locale, {
    style: "currency",
    minimumFractionDigits: 2,
    currency,
  });
}
