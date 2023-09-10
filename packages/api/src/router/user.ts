import { z } from "zod";

import { createTRPCRouter, publicProcedure } from "../trpc";

export const userRouter = createTRPCRouter({
  login: publicProcedure.mutation(({ ctx, input }) => {
    return "login action";
  }),
  register: publicProcedure
    .input(z.object({ email: z.string().min(1), password: z.string().min(1) }))
    .mutation(({ ctx, input }) => {
      return ctx.prisma.user.create({ data: input });
    }),
});
