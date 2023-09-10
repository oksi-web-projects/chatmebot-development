"use client";

import Link from "next/link";

import { api } from "~/utils/api";
import { Container } from "~/components/Container";
import { MyBotStatus } from "./MyBotStatus";

export function MyBots() {
  const { data: bots, isLoading } = api.bot.all.useQuery();

  const { data: result, mutateAsync: startBot } = api.bot.start.useMutation({
    async onSuccess() {},
  });

  if (isLoading) {
    return <>Loading...</>;
  }

  console.log(bots);

  return (
    <>
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
              className="px-3 py-3.5 text-sm font-semibold text-gray-900"
            >
              Status
            </th>
            <th scope="col" className="relative py-3.5 pl-3 pr-4 sm:pr-0">
              <span className="sr-only">Edit</span>
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {bots.map((bot) => (
            <tr key={bot.id}>
              <td className="whitespace-nowrap py-4 pl-4 pr-3 text-left text-sm font-medium text-gray-900 sm:pl-0">
                {bot.token}
              </td>
              <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-center text-sm font-medium sm:pr-0">
                <MyBotStatus botId={bot.id} />
              </td>
              <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-0">
                <button
                  className="text-indigo-600 hover:text-indigo-900"
                  onClick={async () => {
                    const { id } = bot;
                    await startBot({ id });

                    if (isLoading) {
                      console.log("Loading...");
                    }
                  }}
                >
                  Run
                </button>
                <a href="#" className="text-indigo-600 hover:text-indigo-900">
                  Edit<span className="sr-only">, {bot.id}</span>
                </a>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
}
