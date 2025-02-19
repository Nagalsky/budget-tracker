"use server";

import prisma from "@/lib/prisma";
import {
  CreateTransactionSchema,
  CreateTransactionSchemaType,
} from "@/schemas/transaction.schema";
import { getUser } from "@/utils/get-user";

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
