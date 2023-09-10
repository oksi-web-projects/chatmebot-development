"use client";

import { api } from "~/utils/api";

export function MyBotStatus(botId: string) {
  const { data, isLoading } = api.bot.status.useQuery();

  if (isLoading) {
    return <>Loading...</>;
  }

  console.log(data);

  return <>{data ? `status: ${data}` : "asdasdad"}</>;
}
