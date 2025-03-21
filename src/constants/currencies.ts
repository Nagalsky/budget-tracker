export const CURRENCIES = [
  {
    value: "USD",
    label: "$ Dollar",
    locale: "en-US",
  },
  {
    value: "EUR",
    label: "€ Euro",
    locale: "de-DE",
  },
  {
    value: "UAH",
    label: "₴ Hryvnia",
    locale: "uk-UA",
  },
];

export const DEFAULT_CURRENCY = "USD";

export type Currency = (typeof CURRENCIES)[0];
