"use server";
import { DEFAULT_CURRENCY } from "@/constants/currencies";
import prisma from "@/lib/prisma";
import { UpdateUserCurrencySchema } from "@/schemas/user-settings.schema";
import { getUser } from "@/utils/get-user";
import { revalidatePath } from "next/cache";

export async function getUserCurrency() {
  try {
    const user = await getUser();

    let userSettings = await prisma.userSettings.findUnique({
      where: { userId: user.id },
    });

    if (!userSettings) {
      userSettings = await prisma.userSettings.create({
        data: {
          userId: user.id,
          currency: DEFAULT_CURRENCY,
        },
      });
    }

    revalidatePath("/");
    return userSettings;
  } catch (error) {
    console.error("Failed to get user settings:", error);
    throw new Error("Failed to get user settings");
  }
}

export async function updateUserCurrency(currency: string) {
  const validatedField = UpdateUserCurrencySchema.safeParse({ currency });

  if (!validatedField.success) {
    throw validatedField.error;
  }

  try {
    const user = await getUser();

    const userSettings = await prisma.userSettings.update({
      where: {
        userId: user.id,
      },
      data: {
        currency,
      },
    });

    return userSettings;
  } catch {
    throw new Error("Failed to get user settings");
  }
}
