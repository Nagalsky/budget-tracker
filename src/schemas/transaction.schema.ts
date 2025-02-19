import { MAX_DATE_RANGE_DAYS } from "@/constants/date-range";
import { differenceInDays } from "date-fns";
import { z } from "zod";

export const CreateTransactionSchema = z.object({
  amount: z.coerce.number().positive().multipleOf(0.01),
  description: z.string().optional(),
  date: z.coerce.date(),
  category: z.string().min(1),
  type: z.enum(["income", "expense"]),
});

export type CreateTransactionSchemaType = z.infer<
  typeof CreateTransactionSchema
>;

export const GetTransactionSchema = z
  .object({
    from: z.coerce.date(),
    to: z.coerce.date(),
  })
  .refine((args) => {
    const { from, to } = args;
    const days = differenceInDays(to, from);

    const isValidRange = days >= 0 && days <= MAX_DATE_RANGE_DAYS;

    return isValidRange;
  });

export type GetTransactionSchemaType = z.infer<typeof GetTransactionSchema>;
