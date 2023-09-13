"use client";

import { api } from "~/utils/api";
import { MyBotStatus } from "./MyBotStatus";

export function MyBots() {
  const { data: bots, isLoading } = api.bot.all.useQuery();

  if (isLoading) {
    return <>Loading...</>;
  }

  async function startBot(id: string) {
    const { mutateAsync, error, isLoading } = api.bot.start.useMutation();
    await mutateAsync({ id });
    if (isLoading) {
      console.log("Loading...");
    }
  }

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
                  onClick={() => startBot(bot.id)}
                >
                  Run
                </button>
                <button
                  className="text-indigo-600 hover:text-indigo-900"
                  onClick={() => startBot(bot.id)}
                >
                  Stop
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
}
