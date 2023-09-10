// "use client";

import type { NextPageContext } from "next";
import { redirect } from "next/navigation";

import { auth } from "@chatmebot/auth";
import { prisma } from "@chatmebot/db";

import { api } from "~/utils/api";
import Button from "~/components/Button";
import { Container } from "~/components/Container";

export default async function MyOrdersPage() {
  const session = await auth();

  const ctx = {} as NextPageContext;

  const callbackUrl = ctx?.req?.url;

  if (!session?.user) {
    return redirect("/login?callbackUrl=" + callbackUrl);
  }

  const orders = await prisma.order.findMany({
    where: {
      userId: session?.user?.id,
    },
    orderBy: {
      createdDate: "desc",
    },
    include: {
      product: true,
    },
  });

  return (
    <>
      <Container className="pb-32 pt-8 text-center">
        <div className="mx-auto max-w-2xl text-center">
          <h1 className="text-2xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            My Orders
          </h1>
          <p className="mt-6 text-gray-600">
            Anim aute id magna aliqua ad ad non deserunt sunt. Qui irure qui
            lorem cupidatat commodo. Elit sunt amet fugiat veniam occaecat
            fugiat aliqua.
          </p>
        </div>
        <div className="mt-8">
          <div className="text-center">
            <Button className="button-lg" href="/dashboard/products">
              By Product
            </Button>
          </div>
          <div className="mt-8 flow-root">
            <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
              <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
                <table className="min-w-full divide-y divide-gray-300">
                  <thead>
                    <tr>
                      <th
                        scope="col"
                        className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-0"
                      >
                        Order Id
                      </th>
                      <th
                        scope="col"
                        className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                      >
                        Product Name
                      </th>
                      <th
                        scope="col"
                        className="relative py-3.5 pl-3 pr-4 text-sm font-semibold sm:pr-0"
                      >
                        Status
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 bg-white">
                    {orders.map((order) => (
                      <tr key={order.id}>
                        <td className="whitespace-nowrap py-5 pl-4 pr-3 text-left text-sm sm:pl-0">
                          {order.id}
                        </td>
                        <td className="whitespace-nowrap px-3 py-5 text-left text-sm text-gray-500">
                          {order.product.name}
                        </td>
                        <td className="relative whitespace-nowrap py-5 pl-3 pr-4 text-right text-sm font-medium sm:pr-0">
                          {(() => {
                            switch (order.status) {
                              case "created":
                                return (
                                  <span className="inline-flex items-center rounded-md bg-blue-50 px-2 py-1 text-xs font-medium text-green-700 ring-1 ring-inset ring-green-600/20">
                                    {order.status}
                                  </span>
                                );
                              case "processing":
                                return (
                                  <span className="inline-flex items-center rounded-md bg-gray-50 px-2 py-1 text-xs font-medium text-green-700 ring-1 ring-inset ring-green-600/20">
                                    {order.status}
                                  </span>
                                );
                              case "hold":
                                return (
                                  <span className="inline-flex items-center rounded-md bg-gray-50 px-2 py-1 text-xs font-medium text-green-700 ring-1 ring-inset ring-green-600/20">
                                    {order.status}
                                  </span>
                                );
                              case "success":
                                return (
                                  <span className="inline-flex items-center rounded-md bg-green-50 px-2 py-1 text-xs font-medium text-green-700 ring-1 ring-inset ring-green-600/20">
                                    {order.status}
                                  </span>
                                );
                              case "failure":
                                return (
                                  <span className="inline-flex items-center rounded-md bg-red-50 px-2 py-1 text-xs font-medium text-green-700 ring-1 ring-inset ring-green-600/20">
                                    {order.status}
                                  </span>
                                );
                              case "reversed":
                                return (
                                  <span className="inline-flex items-center rounded-md bg-yellow-50 px-2 py-1 text-xs font-medium text-green-700 ring-1 ring-inset ring-green-600/20">
                                    {order.status}
                                  </span>
                                );
                              case "expired":
                                return (
                                  <span className="inline-flex items-center rounded-md bg-gray-50 px-2 py-1 text-xs font-medium text-green-700 ring-1 ring-inset ring-green-600/20">
                                    {order.status}
                                  </span>
                                );
                              default:
                                return (
                                  <span className="inline-flex items-center rounded-md bg-gray-50 px-2 py-1 text-xs font-medium text-green-700 ring-1 ring-inset ring-green-600/20">
                                    unknown
                                  </span>
                                );
                            }
                          })()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </Container>
    </>
  );
}
