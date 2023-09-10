import { NextResponse } from "next/server";

import { prisma } from "@chatmebot/db";

export async function POST(request: Request) {
  const res = await request.json();

  if (res.invoiceId) {
    const newModifiedDate = new Date(res.modifiedDate);
    const invoice = await prisma.invoice.findUnique({
      where: {
        id: res.invoiceId,
      },
    });

    console.log("invoice", invoice);

    if (invoice) {
      if (invoice?.modifiedDate < newModifiedDate) {
        console.log("going to update");
        await prisma.invoice.update({
          where: {
            id: res.invoiceId,
          },
          data: {
            modifiedDate: res.modifiedDate,
            status: res.status,
          },
        });

        await prisma.order.update({
          where: {
            id: invoice.orderId,
          },
          data: {
            modifiedDate: res.modifiedDate,
            status: res.status,
          },
        });
      }

      const invoiceStatus = await prisma.invoiceStatus.create({
        data: {
          invoiceId: res.invoiceId,
          status: res.status,
          modifiedDate: res.modifiedDate,
        },
      });
    }
  }

  console.log(res);
  return new Response(null, {
    status: 204,
  });
}
