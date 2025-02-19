"use server";

import prisma from "@/lib/prisma";
import { OverviewQuerySchema } from "@/schemas/overview.schema";
import { getUser } from "@/utils/get-user";

export async function getBalance(params: { from: Date; to: Date }) {
  const user = await getUser();

  const validatedFiels = OverviewQuerySchema.safeParse(params);

  if (!validatedFiels.success) {
    throw new Error(validatedFiels.error.message);
  }

  const stats = await getBalanceStats(
    user.id,
    validatedFiels.data.from,
    validatedFiels.data.to,
  );

  return stats;
}

export type GetBalanceStatsResponseType = Awaited<
  ReturnType<typeof getBalanceStats>
>;

async function getBalanceStats(userId: string, from: Date, to: Date) {
  const totals = await prisma.transaction.groupBy({
    by: ["type"],
    where: {
      userId,
      date: {
        gte: from,
        lte: to,
      },
    },
    _sum: {
      amount: true,
    },
  });

  return {
    expense: totals.find((t) => t.type === "expense")?._sum.amount || 0,
    income: totals.find((t) => t.type === "income")?._sum.amount || 0,
  };
}

export async function getCategoriesStats(params: { from: Date; to: Date }) {
  const user = await getUser();

  const validatedFiels = OverviewQuerySchema.safeParse(params);

  if (!validatedFiels.success) {
    throw new Error(validatedFiels.error.message);
  }

  const stats = await getCategories(
    user.id,
    validatedFiels.data.from,
    validatedFiels.data.to,
  );

  return stats;
}

export type GetCategoriesStatsResponseType = Awaited<
  ReturnType<typeof getCategories>
>;

async function getCategories(userId: string, from: Date, to: Date) {
  const stats = await prisma.transaction.groupBy({
    by: ["type", "category", "categoryIcon"],
    where: {
      userId,
      date: {
        gte: from,
        lte: to,
      },
    },
    _sum: {
      amount: true,
    },
    orderBy: {
      _sum: {
        amount: "desc",
      },
    },
  });

  return stats;
}
