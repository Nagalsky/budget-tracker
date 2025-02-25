"use server";

import { auth } from "@/auth";
import prisma from "@/lib/prisma";

export async function getChild() {
  try {
    const session = await auth();

    const child = await prisma.child.findUnique({
      where: {
        userId: session?.user.id,
      },
      include: {
        locations: true,
        user: true,
        parent: {
          include: {
            user: true,
          },
        },
      },
    });

    return child;
  } catch {
    throw new Error("Failed to get user");
  }
}

export async function getParent() {
  try {
    const session = await auth();

    const parent = await prisma.parent.findUnique({
      where: {
        userId: session?.user.id,
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

    if (!parent) {
      throw new Error("Parent not found");
    }

    return parent;
  } catch {
    throw new Error("Failed to get user");
  }
}
