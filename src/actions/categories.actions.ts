"use server";

import prisma from "@/lib/prisma";
import {
  CreateCategorySchema,
  CreateCategorySchemaType,
} from "@/schemas/categories.schema";
import { TransactionType } from "@/types/transaction.type";
import { getUser } from "@/utils/get-user";
import { z } from "zod";

export async function getCategories(param: TransactionType) {
  const user = await getUser();
  const validator = z.enum(["expense", "income"]);
  const queryParams = validator.safeParse(param);

  const type = queryParams.data;

  const categories = await prisma.category.findMany({
    where: {
      userId: user.id,
      ...(type && { type }),
    },
    orderBy: {
      name: "asc",
    },
  });

  return categories;
}

export async function createCategory(formData: CreateCategorySchemaType) {
  const user = await getUser();

  const validatedFiels = CreateCategorySchema.safeParse(formData);

  if (!validatedFiels.success) {
    throw new Error(validatedFiels.error.message);
  }

  const { icon, name, type } = validatedFiels.data;

  return await prisma.category.create({
    data: {
      userId: user.id,
      icon,
      name,
      type,
    },
  });
}
