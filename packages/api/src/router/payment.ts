import { TRPCError } from "@trpc/server";
import { z } from "zod";

import { createTRPCRouter, publicProcedure } from "../trpc";

export const paymentRouter = createTRPCRouter({
  create: publicProcedure
    .input(
      z.object({
        productId: z.string().min(1),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const { productId } = input;

      const product = await ctx.prisma.product.findFirst({
        where: {
          id: productId,
        },
      });

      console.log("product", product);

      // const products = await ctx.prisma.product.findMany();
      // console.log("products", products);
      async function postData(url = "", data = {}) {
        // Default options are marked with *

        const response = await fetch(url, {
          method: "POST", // *GET, POST, PUT, DELETE, etc.
          mode: "cors", // no-cors, *cors, same-origin
          cache: "no-cache", // *default, no-cache, reload, force-cache, only-if-cached
          credentials: "same-origin", // include, *same-origin, omit
          headers: {
            "Content-Type": "application/json",
            "X-Token": "uEzL4CYC_Ts54hneNIrNF45JNIgtQ6E6Z7wUvhas-vQ4",
            // 'Content-Type': 'application/x-www-form-urlencoded',
          },
          redirect: "follow", // manual, *follow, error
          referrerPolicy: "no-referrer", // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
          body: JSON.stringify(data), // body data type must match "Content-Type" header
        });
        return response.json(); // parses JSON response into native JavaScript objects
      }

      if (product) {
        const amount = Number(product.price * 100);
        const invoice = await postData(
          "https://api.monobank.ua/api/merchant/invoice/create",
          {
            amount: amount,
            redirectUrl: process.env.PAYMENT_REDIRECT,
            ccy: 978, //EUR
            webHookUrl: process.env.PAYMENT_CALLBACK,
          },
        );
        if (invoice) {
          const userId = ctx.session?.user.id;

          if (!userId) {
            throw new TRPCError({
              code: "NOT_FOUND",
              message: "Product Not Found",
            });
          }

          const order = await ctx.prisma.order.create({
            data: {
              userId: userId,
              productId: productId,
              price: product.price,
            },
          });

          if (!order) {
            throw new TRPCError({
              code: "NOT_FOUND",
              message: "Product Not Found",
            });
          }

          await ctx.prisma.invoice.create({
            data: {
              id: invoice.invoiceId,
              pageUrl: invoice.pageUrl,
              orderId: order.id,
              ammount: amount,
            },
          });

          return invoice;
        }
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Product Not Found",
        });
      } else {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Product Not Found",
        });
      }
    }),
});
