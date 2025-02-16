"use server";

import { DEFAULT_CURRENCY } from "@/constants/currencies";
import { getSession } from "@/lib/get-session";
import prisma from "@/lib/prisma";
import { updateUserCurrencySchema } from "@/schemas/user-settings.schema";
import { revalidatePath } from "next/cache";

export async function getUserCurrency() {
  try {
    const { user } = await getSession();

    const userSettings = await prisma.userSettings.upsert({
      where: {
        userId: user.id,
      },
      update: {},
      create: {
        userId: user.id,
        currency: DEFAULT_CURRENCY,
      },
    });

    revalidatePath("/");
    return userSettings;
  } catch (error) {
    console.error("Failed to get user settings:", error);
    throw new Error("Failed to get user settings");
  }
}

export async function updateUserCurrency(currency: string) {
  const validatedField = updateUserCurrencySchema.safeParse({ currency });

  if (!validatedField.success) {
    throw validatedField.error;
  }

  try {
    const { user } = await getSession();

    const userSettings = await prisma.userSettings.update({
      where: {
        userId: user.id,
      },
      data: {
        currency,
      },
    });

    return userSettings;
  } catch (error) {
    console.error("Failed to get user settings:", error);
    throw new Error("Failed to get user settings");
  }
}
