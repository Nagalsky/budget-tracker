"use server";
import prisma from "@/lib/prisma";
import { getUser } from "./get-user";

export async function getParent() {
  const user = await getUser();

  return prisma.parent.findUnique({
    where: {
      userId: user.id,
    },
    include: {
      childrens: {
        include: {
          user: true,
          locations: true,
        },
      },
    },
  });
}
