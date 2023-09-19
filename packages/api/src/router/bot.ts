import { initTRPC, TRPCError } from "@trpc/server";
import { createTextChangeRange } from "typescript";
import { z, ZodError, ZodIssueCode } from "zod";

import { createTRPCRouter, protectedProcedure } from "../trpc";

const TELEGRAM_BOT_SERVISE_API_URL = process.env.TELEGRAM_BOT_SERVISE_API_URL;

export const botRouter = createTRPCRouter({
  all: protectedProcedure.query(({ ctx: { prisma, session } }) => {
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

      const isBotExist = await ctx.prisma.telegramBot.findUnique({
        where: {
          token: input.token,
          userId: ctx.session.user.id,
        },
      });

      if (isBotExist) {
        const error = new ZodError([
          {
            code: ZodIssueCode.invalid_date,
            path: ["token"],
            message: "Bot already exist",
          },
        ]);
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Bot already exist",
          cause: error,
        });
      }

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
        `${TELEGRAM_BOT_SERVISE_API_URL}/telegram/set-webhook`,
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

  stop: protectedProcedure
    .input(z.object({ id: z.string().min(1) }))
    .mutation(async ({ input, ctx }) => {
      const response = await fetch(
        `${TELEGRAM_BOT_SERVISE_API_URL}/telegram/delete-webhook`,
        {
          method: "DELETE", // *GET, POST, PUT, DELETE, etc.
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
  status: protectedProcedure
    .input(z.object({ id: z.string().min(1) }))
    .query(async ({ ctx, input }) => {
      const response = await fetch(
        `${TELEGRAM_BOT_SERVISE_API_URL}/telegram/status/${input.id}`,
        {
          method: "GET", // *GET, POST, PUT, DELETE, etc.
          mode: "cors", // no-cors, *cors, same-origin
          cache: "no-cache", // *default, no-cache, reload, force-cache, only-if-cached
          // credentials: "same-origin", // include, *same-origin, omit
          headers: {
            // "Content-Type": "application/json",
            "x-api-key": process.env.AUTH_API_KEY || "",
            // 'Content-Type': 'application/x-www-form-urlencoded',
          },
          // redirect: "follow", // manual, *follow, error
          // referrerPolicy: "no-referrer", // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
        },
      );

      const data = (await response.json()) as { status: boolean };

      if (response.ok && data.status) {
        return true;
      }
      return false;
    }),

  delete: protectedProcedure
    .input(z.string())
    .mutation(async ({ input, ctx }) => {
      const isBotExist = await ctx.prisma.telegramBot.findUnique({
        where: {
          id: input,
          userId: ctx.session.user.id,
        },
      });

      if (!isBotExist) {
        const error = new ZodError([
          {
            code: ZodIssueCode.invalid_date,
            path: ["id"],
            message: "Bot not found",
          },
        ]);
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Bot not found",
          cause: error,
        });
      }

      return ctx.prisma.telegramBot.delete({
        where: {
          id: input,
          userId: ctx.session.user.id,
        },
      });
    }),
});
