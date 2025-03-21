"use client";

import type React from "react";

import { createTransaction } from "@/actions/transactions.actions";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Popover, PopoverTrigger } from "@/components/ui/popover";
import { dateToUTCDate } from "@/lib/date-to-utc-date";
import { cn } from "@/lib/utils";
import {
  CreateTransactionSchema,
  type CreateTransactionSchemaType,
} from "@/schemas/transaction.schema";
import type { TransactionType } from "@/types/transaction.type";
import { zodResolver } from "@hookform/resolvers/zod";
import { PopoverContent } from "@radix-ui/react-popover";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { format } from "date-fns";
import { CalendarIcon, Loader2 } from "lucide-react";
import { type FC, useCallback, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import CategoryPicker from "../category-picker";

type Props = {
  trigger: React.ReactNode;
  type: TransactionType;
};

const CreateTransactionDialog: FC<Props> = ({ trigger, type }) => {
  const [open, setOpen] = useState(false);
  const form = useForm<CreateTransactionSchemaType>({
    resolver: zodResolver(CreateTransactionSchema),
    defaultValues: {
      type: type,
      date: new Date(),
      description: "",
      amount: 0,
      category: "",
    },
  });

  const queryClient = useQueryClient();

  const { mutate, isPending } = useMutation({
    mutationFn: createTransaction,
    onSuccess: () => {
      toast.success("Transaction create successfully 🎉", {
        id: "create-transaction",
      });

      queryClient.invalidateQueries({
        queryKey: ["overview"],
      });

      setOpen(false);
    },
  });

  const onSubmit = useCallback(
    (values: CreateTransactionSchemaType) => {
      toast.success("Creating transaction...", {
        id: "create-transaction",
      });
      mutate({
        ...values,
        date: dateToUTCDate(values.date),
      });
    },
    [mutate],
  );

  return (
    <Dialog
      open={open}
      onOpenChange={(open) => {
        setOpen(open);
        form.reset();
      }}
    >
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className="sm:max-w-xl md:max-w-2xl">
        <DialogHeader>
          <DialogTitle>
            Create a new
            <span
              className={cn(
                "mx-1 inline-block",
                type === "income" ? "text-emerald-500" : "text-rose-500",
              )}
            >
              {type}
            </span>
            transaction
          </DialogTitle>
          <DialogDescription>
            Make changes to your profile here. Click save when you&apos;re done.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                  <FormDescription>
                    Transaction description (optional)
                  </FormDescription>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="amount"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Amount</FormLabel>
                  <FormControl>
                    <Input
                      type="text"
                      {...field}
                      onChange={(e) => {
                        const value = e.target.value.replace(/[^0-9.,]/g, "");
                        const normalized = value.replace(",", ".");
                        if (normalized.split(".").length > 2) return;
                        field.onChange(normalized);
                      }}
                      value={field.value}
                    />
                  </FormControl>
                  <FormMessage />
                  <FormDescription>
                    Transaction amount (required) - Use period or comma as
                    decimal separator
                  </FormDescription>
                </FormItem>
              )}
            />
            <div className="grid grid-cols-1 items-start gap-4 sm:grid-cols-2">
              <FormField
                control={form.control}
                name="category"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Category</FormLabel>
                    <FormControl>
                      <CategoryPicker type={type} {...field} />
                    </FormControl>
                    <FormMessage />
                    <FormDescription>
                      Select a category for this transaction
                    </FormDescription>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="date"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Transaction date</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant={"outline"}
                            className={cn(
                              "pl-3 text-left font-normal",
                              !field.value && "text-muted",
                            )}
                          >
                            {field.value ? (
                              format(field.value, "PPP")
                            ) : (
                              <span>Pick a date</span>
                            )}
                            <CalendarIcon className="ml-auto opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={(value) => {
                            if (!value) return;
                            field.onChange(value);
                          }}
                          initialFocus
                          disabled={(date) => date > new Date()}
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                    <FormDescription>
                      Select a date for this transaction
                    </FormDescription>
                  </FormItem>
                )}
              />
            </div>
          </form>
        </Form>

        <DialogFooter>
          <DialogClose asChild>
            <Button variant={"secondary"} type="button">
              Cancel
            </Button>
          </DialogClose>
          <Button onClick={form.handleSubmit(onSubmit)} disabled={isPending}>
            {!isPending ? "Create" : <Loader2 className="animate-spin" />}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default CreateTransactionDialog;
