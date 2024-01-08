import { z } from "zod";

import { createTRPCRouter, protectedProcedure } from "../trpc";

export const instagramRouter = createTRPCRouter({
  getMyInstagramData: protectedProcedure
    .query(async ({ input, ctx: { prisma, session } }) => {

      const userId = session?.user.id;

      const user = await prisma.user.findUnique({
        where: { id: userId },
      });

      if (!user?.instagramToken) {
        return {
          data: [],
          isTokenValid: false,
        };
      }

      const response = await fetch(
        `https://graph.instagram.com/me/media?fields=id,caption,media_url,media_type,timestamp&limit=10&access_token=${user?.instagramToken}`,
      );

      const posts = await response.json();
      return {
        posts: posts.data,
        isTokenValid: true,
      };
    }),

  disconnect: protectedProcedure.mutation(async ({ ctx: { prisma, session } }) => {
    await prisma.user.update({
      where: { id: session.user.id },
      data: {
        instagramToken: null,
      },
    });
  }),
});
