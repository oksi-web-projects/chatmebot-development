import { z } from "zod";

import { createTRPCRouter, protectedProcedure } from "../trpc";

export const botRouter = createTRPCRouter({
  all: protectedProcedure.query(({ ctx: { prisma, session } }) => {
    console.log(session.user.id);
    return prisma.telegramBot.findMany({
      where: {
        userId: session.user.id,
      },
      orderBy: { id: "desc" },
    });
  }),
  byId: protectedProcedure
    .input(z.object({ id: z.string() }))
    .query(({ ctx, input }) => {
      return ctx.prisma.telegramBot.findFirst({
        where: {
          id: input.id,
          userId: ctx.session.user.id,
        },
      });
    }),
  create: protectedProcedure
    .input(z.object({ token: z.string().min(1) }))
    .mutation(async (opts) => {
      const { input, ctx } = opts;

      return ctx.prisma.telegramBot.create({
        data: {
          token: input.token,
          userId: ctx.session.user.id,
        },
      });
    }),

  start: protectedProcedure
    .input(z.object({ id: z.string().min(1) }))
    .mutation(async ({ input, ctx }) => {
      const response = await fetch(
        "https://tg-bot-615b.onrender.com/telegram/set-webhook",
        {
          method: "POST", // *GET, POST, PUT, DELETE, etc.
          mode: "cors", // no-cors, *cors, same-origin
          cache: "no-cache", // *default, no-cache, reload, force-cache, only-if-cached
          credentials: "same-origin", // include, *same-origin, omit
          headers: {
            "Content-Type": "application/json",
            "x-api-key": process.env.AUTH_API_KEY || "",
            // 'Content-Type': 'application/x-www-form-urlencoded',
          },
          redirect: "follow", // manual, *follow, error
          referrerPolicy: "no-referrer", // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
          body: JSON.stringify({
            telegramBotId: input.id,
          }), // body data type must match "Content-Type" header
        },
      );

      if (response.ok) {
        return true;
      }

      return false;
    }),

  stop: protectedProcedure.mutation(({ ctx }) => {
    return true;
  }),
  status: protectedProcedure.query(({ ctx }) => {
    return true;
  }),

  // delete: publicProcedure.input(z.string()).mutation(({ ctx, input }) => {
  //   return ctx.prisma.chat.delete({ where: { id: input } });
  // }),
});