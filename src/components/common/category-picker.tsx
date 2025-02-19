import { useGetCategories } from "@/hooks/use-get-categories";
import { cn } from "@/lib/utils";
import { TransactionType } from "@/types/transaction.type";
import { Category } from "@prisma/client";
import { Check, ChevronsUpDown } from "lucide-react";
import { FC, useEffect, useState } from "react";
import { Button } from "../ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "../ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import CreateCategoryDialog from "./dialogs/create-category-dialog";

type Props = {
  type: TransactionType;
  onChange: (value: string) => void;
};

const CategoryPicker: FC<Props> = ({ type, onChange }) => {
  const [open, setOpen] = useState<boolean>(false);
  const [value, setValue] = useState<string>("");

  const { data: categories } = useGetCategories(type);

  const selectedCategory = categories?.find(
    (category) => category.name === value,
  );

  const onSuccessCallback = (category: Category) => {
    setValue(category.name);
    setOpen(false);
  };

  useEffect(() => {
    if (!value) {
      return;
    }
    onChange(value);
  }, [onChange, value]);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant={"outline"}
          role="combobox"
          aria-expanded={open}
          className="justify-between"
        >
          {selectedCategory ? (
            <CategoryRow category={selectedCategory} />
          ) : (
            "Select category"
          )}
          <ChevronsUpDown className="ml-2 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="right-0 w-[260px]" align="start">
        <Command
          onSubmit={(e) => {
            e.preventDefault();
          }}
        >
          <CommandInput placeholder="Search category..." className="border-0" />
          <CreateCategoryDialog
            type={type}
            onSuccessCallback={onSuccessCallback}
          />
          <CommandEmpty>
            <p>Category not found</p>
            <p className="text-muted-foreground text-xs">
              Typ: Create a new category
            </p>
          </CommandEmpty>
          <CommandGroup>
            <CommandList>
              {categories?.map((category) => (
                <CommandItem
                  key={category.name}
                  onSelect={() => {
                    setValue(category.name);
                    setOpen(false);
                  }}
                >
                  <CategoryRow category={category} />
                  <Check
                    className={cn(
                      "ml-2 opacity-0",
                      value === category.name && "opacity-100",
                    )}
                  />
                </CommandItem>
              ))}
            </CommandList>
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  );
};

export default CategoryPicker;

function CategoryRow({ category }: { category: Category }) {
  return (
    <div className="flex items-center gap-2">
      <span role="img">{category.icon}</span>
      <span>{category.name}</span>
    </div>
  );
}
