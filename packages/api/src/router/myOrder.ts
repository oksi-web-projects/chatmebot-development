import { TRPCError } from "@trpc/server";
import { z } from "zod";

import { createTRPCRouter, publicProcedure } from "../trpc";

export const myOrderRouter = createTRPCRouter({
  all: publicProcedure.query(async ({ ctx: { prisma, session } }) => {
    const userId = session?.user.id;

    if (!userId) {
      throw new TRPCError({
        code: "NOT_FOUND",
        message: "Product Not Found",
      });
    }

    return await prisma.order.findMany({
      where: {
        userId: userId,
      },
      orderBy: { id: "desc" },
    });
  }),
});
