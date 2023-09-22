import { z } from "zod";

import { createTRPCRouter, protectedProcedure } from "../trpc";

export const chatRouter = createTRPCRouter({
  all: protectedProcedure.query(({ ctx: { prisma, session } }) => {
    console.log(session.user.id);
    return prisma.chat.findMany({
      where: {
        userId: session.user.id,
      },
      orderBy: { createdAt: "asc" },
    });
  }),
  byId: protectedProcedure
    .input(z.object({ id: z.string() }))
    .query(({ ctx, input }) => {
      return ctx.prisma.chat.findFirst({
        where: {
          id: input.id,
          userId: ctx.session.user.id,
        },
      });
    }),
  create: protectedProcedure
    .input(z.object({ name: z.string().min(10) }))
    .mutation(async (opts) => {
      const { input, ctx } = opts;
      const freeChats = await ctx.prisma.chat.count({
        where: {
          userId: ctx.session.user.id,
          expires: null,
        },
      });

      return ctx.prisma.chat.create({
        data: {
          name: input.name,
          userId: ctx.session.user.id,
          expires: freeChats < 1 ? null : new Date(),
        },
      });
    }),
  // delete: publicProcedure.input(z.string()).mutation(({ ctx, input }) => {
  //   return ctx.prisma.chat.delete({ where: { id: input } });
  // }),
});
