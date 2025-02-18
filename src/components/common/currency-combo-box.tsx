"use client";

import * as React from "react";

import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { CURRENCIES, Currency } from "@/constants/currencies";
import { useGetCurrency } from "@/hooks/use-get-currency";
import { useMediaQuery } from "@/hooks/use-media-query";
import { useUpdateCurrency } from "@/hooks/use-update-currency";
import { toast } from "sonner";
import SkeletonWrapper from "./skeleton-wrapper";

export function CurrencyComboBox() {
  const [open, setOpen] = React.useState(false);
  const isDesktop = useMediaQuery("(min-width: 768px)");
  const [selectedOption, setSelectedOption] = React.useState<Currency | null>(
    null,
  );

  const { data, isFetching } = useGetCurrency();

  React.useEffect(() => {
    if (!data) return;
    const userCurrency = CURRENCIES.find(
      (currency) => currency.value === data.currency,
    );
    if (userCurrency) {
      setSelectedOption(userCurrency);
    }
  }, [data]);

  const { mutate: updateCurrencyMutate, isPending: isUpdateCurrencyPending } =
    useUpdateCurrency(CURRENCIES, setSelectedOption);

  const selectOption = React.useCallback(
    (currency: Currency | null) => {
      if (!currency) {
        toast.error("Please select a currency");
        return;
      }
      toast.loading("Updateing currency...", {
        id: "update-currency",
      });

      updateCurrencyMutate(currency.value);
    },
    [updateCurrencyMutate],
  );

  if (isDesktop) {
    return (
      <SkeletonWrapper isLoading={isFetching}>
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className="w-full justify-start"
              disabled={isUpdateCurrencyPending}
            >
              {selectedOption ? <>{selectedOption.label}</> : <>Set currency</>}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-[200px] p-0" align="start">
            <OptionList
              setOpen={setOpen}
              setSelectedOption={selectOption}
              selectedOption={selectedOption}
            />
          </PopoverContent>
        </Popover>
      </SkeletonWrapper>
    );
  }

  return (
    <SkeletonWrapper isLoading={isFetching}>
      <Drawer open={open} onOpenChange={setOpen} autoFocus={open}>
        <DrawerTrigger asChild>
          <Button
            variant="outline"
            className="w-full justify-start"
            disabled={isUpdateCurrencyPending}
          >
            {selectedOption ? <>{selectedOption.label}</> : <>Set currency</>}
          </Button>
        </DrawerTrigger>
        <DrawerContent>
          <DrawerHeader>
            <DrawerTitle>Currency</DrawerTitle>
            <DrawerDescription>Set your currency.</DrawerDescription>
          </DrawerHeader>
          <div className="border-t py-6">
            <OptionList
              selectedOption={selectedOption}
              setOpen={setOpen}
              setSelectedOption={selectOption}
            />
          </div>
        </DrawerContent>
      </Drawer>
    </SkeletonWrapper>
  );
}

function OptionList({
  setOpen,
  setSelectedOption,
  selectedOption,
}: {
  setOpen: (open: boolean) => void;
  setSelectedOption: (status: Currency | null) => void;
  selectedOption: Currency | null;
}) {
  return (
    <Command>
      {/* <CommandInput placeholder="Filter currency..." /> */}
      <CommandList>
        <CommandEmpty>No results found.</CommandEmpty>
        <CommandGroup>
          {CURRENCIES.map((currency) => (
            <CommandItem
              key={currency.value}
              value={currency.value}
              className="max-sm:py-2.5"
              onSelect={(value) => {
                setSelectedOption(
                  CURRENCIES.find((priority) => priority.value === value) ||
                    null,
                );
                setOpen(false);
              }}
              disabled={selectedOption?.value === currency.value}
            >
              {currency.label}
            </CommandItem>
          ))}
        </CommandGroup>
      </CommandList>
    </Command>
  );
}
