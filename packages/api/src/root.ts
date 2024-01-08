import { authRouter } from "./router/auth";
import { botRouter } from "./router/bot";
import { chatRouter } from "./router/chat";
import { instagramRouter } from "./router/instagram";
import { myOrderRouter } from "./router/myOrder";
import { paymentRouter } from "./router/payment";
import { postRouter } from "./router/post";
import { userRouter } from "./router/user";
import { createTRPCRouter } from "./trpc";

export const appRouter = createTRPCRouter({
  auth: authRouter,
  post: postRouter,
  chat: chatRouter,
  bot: botRouter,
  user: userRouter,
  payment: paymentRouter,
  myOrder: myOrderRouter,
  instagram: instagramRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
