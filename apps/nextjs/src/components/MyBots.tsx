"use client";

import Link from "next/link";
import { toast, ToastContainer } from "react-toastify";

import { api } from "~/utils/api";
import { MyBotStatus } from "./MyBotStatus";

export function MyBots() {
  const { data: bots, isLoading } = api.bot.all.useQuery();

  if (isLoading) {
    return <>Loading...</>;
  }

  return (
    <>
      <ToastContainer />
      <table className="min-w-full divide-y divide-gray-300">
        <thead>
          <tr>
            <th
              scope="col"
              className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-0"
            >
              Token
            </th>
            <th
              scope="col"
              className="px-3 py-3.5 text-right text-sm font-semibold text-gray-900"
            >
              Status
            </th>
            <th
              scope="col"
              className="px-3 py-3.5 text-right text-sm font-semibold text-gray-900"
            ></th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {bots.map((bot) => {
            return (
              <tr key={bot.id}>
                <td className="whitespace-nowrap py-4 pl-4 pr-3 text-left text-sm font-medium text-gray-900 sm:pl-0">
                  {bot.token}
                </td>
                <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-0">
                  <MyBotStatus botId={bot.id} />
                </td>
                <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-0">
                  <Link
                    href={`/dashboard/my-bots/${bot.id}/view`}
                    className="text-indigo-600 hover:text-indigo-900"
                  >
                    View<span className="sr-only">, {bot.id}</span>
                  </Link>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </>
  );
}
