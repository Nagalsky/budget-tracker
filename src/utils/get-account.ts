import prisma from "@/lib/prisma";

export const getAccountByUserId = async (userId: string) => {
  const account = await prisma.account.findFirst({
    where: {
      userId,
    },
  });

  return account;
};
