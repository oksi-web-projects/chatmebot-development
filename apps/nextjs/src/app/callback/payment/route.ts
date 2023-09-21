import { NextResponse } from "next/server";

import { prisma } from "@chatmebot/db";

interface webhookRequest {
  invoiceId: string;
  status: string;
  modifiedDate: string;
}

enum Status {
  created = "CREATED",
  processing = "PROCESSING",
  hold = "HOLD",
  success = "SUCCESS",
  failure = "FAILURE",
  reversed = "REVERSED",
  expired = "EXPIRED",
}

export async function POST(request: Request) {
  const res = (await request.json()) as webhookRequest;

  const status = Status[res.status as keyof typeof Status];

  if (res.invoiceId) {
    const newModifiedDate = new Date(res.modifiedDate);
    const invoice = await prisma.invoice.findUnique({
      where: {
        id: res.invoiceId,
      },
    });

    if (invoice) {
      const invoiceStatus = await prisma.invoiceStatus.create({
        data: {
          invoiceId: res.invoiceId,
          status: status,
          modifiedDate: res.modifiedDate,
        },
      });

      if (status === Status.success && invoice.status !== Status.success) {
        if (invoice.productId) {
          const product = await prisma.product.findUnique({
            where: {
              id: invoice.productId,
            },
          });

          const invoiceToChat = await prisma.invoiceToChat.findFirst({
            where: {
              invoiceId: res.invoiceId,
            },
          });

          if (product) {
            if (invoiceToChat) {
              const chat = await prisma.chat.findUnique({
                where: {
                  id: invoiceToChat.chatId,
                },
              });

              if (chat) {
                let date = new Date();

                if (chat?.expires && chat.expires > date) {
                  date = new Date(chat.expires);
                }

                if (product?.params) {
                  const params = product?.params as {
                    duration?: { m?: number; y?: number };
                  };

                  if (params?.duration?.m) {
                    date.setMonth(date.getMonth() + params.duration.m);
                  }
                  if (params?.duration?.y) {
                    date.setFullYear(date.getFullYear() + params.duration.y);
                  }
                }

                await prisma.chat.update({
                  where: {
                    id: invoiceToChat.chatId,
                  },
                  data: {
                    expires: date,
                  },
                });
              }
            }
          }
        }

        if (invoice?.modifiedDate < newModifiedDate) {
          await prisma.invoice.update({
            where: {
              id: res.invoiceId,
            },
            data: {
              modifiedDate: res.modifiedDate,
              status: status,
            },
          });
        }
      }
    }
  }

  return new Response(null, {
    status: 204,
  });
}
