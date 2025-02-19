"use server";

import { formatterCurrency } from "@/lib/formatter-currency";
import prisma from "@/lib/prisma";
import {
  CreateTransactionSchema,
  CreateTransactionSchemaType,
  GetTransactionSchema,
  GetTransactionSchemaType,
} from "@/schemas/transaction.schema";
import { getUser } from "@/utils/get-user";
import { endOfDay } from "date-fns";

export async function createTransaction(formData: CreateTransactionSchemaType) {
  const validatedFiels = CreateTransactionSchema.safeParse(formData);

  if (!validatedFiels.success) {
    throw new Error(validatedFiels.error.message);
  }

  const user = await getUser();

  const { amount, category, date, description, type } = validatedFiels.data;

  const categoryRow = await prisma.category.findFirst({
    where: {
      userId: user.id,
      name: category,
    },
  });

  if (!categoryRow) {
    throw new Error("Category not found");
  }

  await prisma.$transaction([
    prisma.transaction.create({
      data: {
        userId: user.id,
        amount,
        date,
        description: description || "",
        type,
        category: categoryRow.name,
        categoryIcon: categoryRow.icon,
      },
    }),
  ]);

  await prisma.monthHistory.upsert({
    where: {
      day_month_year_userId: {
        userId: user.id,
        day: date.getUTCDate(),
        month: date.getUTCMonth(),
        year: date.getUTCFullYear(),
      },
    },
    create: {
      userId: user.id,
      day: date.getUTCDate(),
      month: date.getUTCMonth(),
      year: date.getUTCFullYear(),
      expense: type === "expense" ? amount : 0,
      income: type === "income" ? amount : 0,
    },
    update: {
      expense: {
        increment: type === "expense" ? amount : 0,
      },
      income: {
        increment: type === "income" ? amount : 0,
      },
    },
  });

  await prisma.yearHistory.upsert({
    where: {
      month_year_userId: {
        userId: user.id,
        month: date.getUTCMonth(),
        year: date.getUTCFullYear(),
      },
    },
    create: {
      userId: user.id,
      month: date.getUTCMonth(),
      year: date.getUTCFullYear(),
      expense: type === "expense" ? amount : 0,
      income: type === "income" ? amount : 0,
    },
    update: {
      expense: {
        increment: type === "expense" ? amount : 0,
      },
      income: {
        increment: type === "income" ? amount : 0,
      },
    },
  });
}

export async function getTransactions(params: GetTransactionSchemaType) {
  const user = await getUser();

  const validatedFiels = GetTransactionSchema.safeParse(params);

  if (!validatedFiels.success) {
    throw new Error(validatedFiels.error.message);
  }

  const { from, to } = validatedFiels.data;

  const transactions = await getTransactionsHistory(user.id, from, to);

  return transactions;
}

export type GetTransactionHistoryResponseType = Awaited<
  ReturnType<typeof getTransactionsHistory>
>;

async function getTransactionsHistory(userId: string, from: Date, to: Date) {
  const userSettings = await prisma.userSettings.findUnique({
    where: {
      userId,
    },
  });

  if (!userSettings) {
    throw new Error("User settings not found");
  }

  const formatter = formatterCurrency(userSettings.currency);

  const transactions = await prisma.transaction.findMany({
    where: {
      userId,
      date: {
        gte: from,
        lte: endOfDay(to),
      },
    },
    orderBy: {
      date: "desc",
    },
  });

  return transactions.map((transaction) => ({
    ...transaction,
    formatterAmmout: formatter.format(transaction.amount),
  }));
}

export async function deleteTransaction(id: string) {
  const user = await getUser();

  const transaction = await prisma.transaction.findFirst({
    where: {
      userId: user.id,
      id,
    },
  });

  if (!transaction) {
    throw new Error("bad request");
  }

  await prisma.$transaction([
    prisma.transaction.delete({
      where: {
        id,
        userId: user.id,
      },
    }),
    prisma.monthHistory.update({
      where: {
        day_month_year_userId: {
          userId: user.id,
          day: transaction.date.getUTCDate(),
          month: transaction.date.getUTCMonth(),
          year: transaction.date.getUTCFullYear(),
        },
      },
      data: {
        ...(transaction.type === "expense" && {
          expense: {
            decrement: transaction.amount,
          },
        }),
        ...(transaction.type === "income" && {
          income: {
            decrement: transaction.amount,
          },
        }),
      },
    }),
    prisma.yearHistory.update({
      where: {
        month_year_userId: {
          userId: user.id,
          month: transaction.date.getUTCMonth(),
          year: transaction.date.getUTCFullYear(),
        },
      },
      data: {
        ...(transaction.type === "expense" && {
          expense: {
            decrement: transaction.amount,
          },
        }),
        ...(transaction.type === "income" && {
          income: {
            decrement: transaction.amount,
          },
        }),
      },
    }),
  ]);
}
