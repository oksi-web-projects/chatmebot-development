import { TRPCError } from "@trpc/server";
import { z, ZodError, ZodIssueCode } from "zod";

import { createTRPCRouter, protectedProcedure, publicProcedure } from "../trpc";

const PAYMENT_AUTH_TOKEN = "uEzL4CYC_Ts54hneNIrNF45JNIgtQ6E6Z7wUvhas-vQ4";

interface MerchantPaymInfo {
  reference?: string;
  destination?: string;
  comment?: string;
  basketOrder?: string;
}

interface InvoiceCreateRequest {
  amount: number; //Сума оплати у мінімальних одиницях (копійки для гривні)
  merchantPaymInfo?: MerchantPaymInfo;
  ccy?: number; // ISO 4217 код валюти, за замовчуванням 980 (гривня), 978 - EUR, 840 - USD
  redirectUrl?: string;
  webHookUrl?: string;
}

interface InvoiceCreateResponse {
  invoiceId: string;
  pageUrl: string;
}

async function createMonoInvoice(data: InvoiceCreateRequest) {
  try {
    const response = await fetch(
      "https://api.monobank.ua/api/merchant/invoice/create",
      {
        method: "POST", // *GET, POST, PUT, DELETE, etc.
        headers: {
          "Content-Type": "application/json",
          "X-Token": PAYMENT_AUTH_TOKEN,
        },
        body: JSON.stringify(data), // body data type must match "Content-Type" header
      },
    );
    if (response.ok) {
      const monoResponse: InvoiceCreateResponse =
        (await response.json()) as InvoiceCreateResponse;
      return monoResponse; // parses JSON response into native JavaScript objects
    }
    return false;
  } catch (error) {
    return false;
  }
}

export const paymentRouter = createTRPCRouter({
  create: publicProcedure
    .input(
      z.object({
        productId: z.string().min(1),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      return false;
      //   const { productId } = input;

      //   const product = await ctx.prisma.product.findFirst({
      //     where: {
      //       id: productId,
      //     },
      //   });

      //   console.log("product", product);

      //   // const products = await ctx.prisma.product.findMany();
      //   // console.log("products", products);
      //   async function postData(url = "", data = {}) {
      //     // Default options are marked with *

      //     const response = await fetch(url, {
      //       method: "POST", // *GET, POST, PUT, DELETE, etc.
      //       mode: "cors", // no-cors, *cors, same-origin
      //       cache: "no-cache", // *default, no-cache, reload, force-cache, only-if-cached
      //       credentials: "same-origin", // include, *same-origin, omit
      //       headers: {
      //         "Content-Type": "application/json",
      //         "X-Token": PAYMENT_AUTH_TOKEN,
      //         // 'Content-Type': 'application/x-www-form-urlencoded',
      //       },
      //       redirect: "follow", // manual, *follow, error
      //       referrerPolicy: "no-referrer", // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
      //       body: JSON.stringify(data), // body data type must match "Content-Type" header
      //     });
      //     return response.json(); // parses JSON response into native JavaScript objects
      //   }

      //   if (product) {
      //     const amount = Number(product.price * 100);
      //     const invoice = await postData(
      //       "https://api.monobank.ua/api/merchant/invoice/create",
      //       {
      //         amount: amount,
      //         redirectUrl: process.env.PAYMENT_REDIRECT,
      //         ccy: 978, //EUR
      //         webHookUrl: process.env.PAYMENT_CALLBACK,
      //       },
      //     );
      //     if (invoice) {
      //       const userId = ctx.session?.user.id;

      //       if (!userId) {
      //         throw new TRPCError({
      //           code: "NOT_FOUND",
      //           message: "Product Not Found",
      //         });
      //       }

      //       await ctx.prisma.invoice.create({
      //         data: {
      //           id: invoice.invoiceId,
      //           pageUrl: invoice.pageUrl,
      //           orderId: order.id,
      //           ammount: amount,
      //         },
      //       });

      //       return invoice;
      //     }
      //     throw new TRPCError({
      //       code: "NOT_FOUND",
      //       message: "Product Not Found",
      //     });
      //   } else {
      //     throw new TRPCError({
      //       code: "NOT_FOUND",
      //       message: "Product Not Found",
      //     });
      //   }
    }),
  createChatPayment: protectedProcedure
    .input(
      z.object({
        productId: z.string(),
        chatId: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const { productId, chatId } = input;

      const product = await ctx.prisma.product.findUnique({
        where: {
          id: productId,
        },
      });

      if (!product) {
        const productError = new ZodError([
          {
            code: ZodIssueCode.invalid_date,
            path: ["productId"],
            message: "Product does not found",
          },
        ]);

        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Product Not Found",
          cause: productError,
        });
      }

      const chat = await ctx.prisma.chat.findUnique({
        where: {
          id: chatId,
          userId: ctx.session?.user.id,
        },
      });

      if (!chat) {
        const chatError = new ZodError([
          {
            code: ZodIssueCode.invalid_date,
            path: ["chatId"],
            message: "Chat does not found",
          },
        ]);

        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Chat Not Found",
          cause: chatError,
        });
      }

      const invoiceCreateRequest: InvoiceCreateRequest = {
        amount: Math.round(product.price * 100),
        redirectUrl: process.env.PAYMENT_REDIRECT,
        ccy: 978, //EUR
        webHookUrl: process.env.PAYMENT_CALLBACK,
      };

      const monoInvoice: InvoiceCreateResponse | boolean =
        await createMonoInvoice(invoiceCreateRequest);

      if (!monoInvoice) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Product Not Found",
        });
      }

      const invoice = await ctx.prisma.invoice.create({
        data: {
          id: monoInvoice.invoiceId,
          pageUrl: monoInvoice.pageUrl,
          productId: product.id,
          ammount: product.price,
        },
      });

      const invoiceToChat = await ctx.prisma.invoiceToChat.create({
        data: {
          chatId: chatId,
          invoiceId: invoice.id,
        },
      });

      return {
        pageUrl: monoInvoice?.pageUrl,
      };
    }),
});
