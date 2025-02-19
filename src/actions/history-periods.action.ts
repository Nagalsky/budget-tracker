"use server";

import prisma from "@/lib/prisma";
import {
  GetHistorySchema,
  GetHistorySchemaType,
} from "@/schemas/history.schema";

import { Period, Timeframe } from "@/types/timeframe.type";
import { getUser } from "@/utils/get-user";
import { getDaysInMonth } from "date-fns";

export async function getHistoryPeriods() {
  const user = await getUser();

  const periods = await historyPeriods(user.id);

  return periods;
}

export type GetHistoryPeriosResponseType = Awaited<
  ReturnType<typeof historyPeriods>
>;

async function historyPeriods(userId: string) {
  const result = await prisma.monthHistory.findMany({
    where: {
      userId,
    },
    select: {
      year: true,
    },
    distinct: ["year"],
    orderBy: {
      year: "asc",
    },
  });

  const years = result.map((el) => el.year);

  if (years.length === 0) {
    return [new Date().getFullYear()];
  }

  return years;
}

export async function getHistoryData(params: GetHistorySchemaType) {
  const user = await getUser();

  const validatedFiels = GetHistorySchema.safeParse(params);

  if (!validatedFiels.success) {
    throw new Error(validatedFiels.error.message);
  }

  const data = await historyData(user.id, validatedFiels.data.timeframe, {
    month: validatedFiels.data.month,
    year: validatedFiels.data.year,
  });

  return data;
}

export type GetHistoryDataResponseType = Awaited<typeof historyData>;

async function historyData(
  userId: string,
  timeframe: Timeframe,
  period: Period,
) {
  switch (timeframe) {
    case "year":
      return await getYearHistoryData(userId, period.year);
    case "month":
      return await getMonthHistoryData(userId, period.year, period.month);
  }
}

type HistoryData = {
  expense: number;
  income: number;
  year: number;
  month: number;
  day?: number;
};

async function getYearHistoryData(userId: string, year: number) {
  const result = await prisma.yearHistory.groupBy({
    by: ["month"],
    where: {
      userId,
      year,
    },
    _sum: {
      expense: true,
      income: true,
    },
    orderBy: {
      month: "asc",
    },
  });

  if (!result || result.length === 0) return [];

  const history: HistoryData[] = [];

  for (let i = 0; i < 12; i++) {
    let expense = 0;
    let income = 0;

    const month = result.find((row) => row.month === i);

    if (month) {
      expense = month._sum.expense || 0;
      income = month._sum.income || 0;
    }

    history.push({ year, month: i, expense, income });
  }

  return history;
}

async function getMonthHistoryData(
  userId: string,
  year: number,
  month: number,
) {
  const result = await prisma.monthHistory.groupBy({
    by: ["day"],
    where: {
      userId,
      year,
      month,
    },
    _sum: {
      expense: true,
      income: true,
    },
    orderBy: {
      day: "asc",
    },
  });

  if (!result || result.length === 0) return [];

  const history: HistoryData[] = [];
  const daysInMonth = getDaysInMonth(new Date(year, month));

  for (let i = 0; i <= daysInMonth; i++) {
    let expense = 0;
    let income = 0;

    const day = result.find((row) => row.day === i);

    if (day) {
      expense = day._sum.expense || 0;
      income = day._sum.income || 0;
    }

    history.push({ year, month, day: i, expense, income });
  }

  return history;
}
