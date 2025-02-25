import prisma from "@/lib/prisma";
import { getUser } from "./get-user";

export async function getChild() {
  const user = await getUser();

  const child = await prisma.child.findUnique({
    where: {
      userId: user.id,
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
}
