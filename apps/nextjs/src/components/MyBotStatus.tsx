"use client";

import { ChangeEvent, FormEvent, useEffect, useState } from "react";
import { toast, ToastContainer } from "react-toastify";

import "react-toastify/dist/ReactToastify.css";

import { api } from "~/utils/api";

export function MyBotStatus({ botId }: { botId: string }) {
  const [currentStatus, setCurrentStatus] = useState(false);
  const { data: status, isLoading } = api.bot.status.useQuery({ id: botId });
  const {
    mutateAsync: startBot,
    error: errorStarting,
    isLoading: isStarting,
  } = api.bot.start.useMutation();
  const {
    mutateAsync: stopBot,
    error: errorStopping,
    isLoading: isStopping,
  } = api.bot.stop.useMutation();

  useEffect(() => {
    setCurrentStatus(status ?? false);
  }, [status]);

  if (isLoading) {
    return <>Loading...</>;
  }

  return (
    <>
      <div className="flex justify-end gap-4">
        <div hidden={isStopping || isStarting}>
          {currentStatus ? "Running" : "Stopped"}
        </div>
        <div hidden={!isStopping}>Stopping...</div>
        <div hidden={!isStarting}>Starting...</div>
        <button
          disabled={isStopping || isStarting}
          hidden={currentStatus === true}
          className="text-indigo-600 hover:text-indigo-900 disabled:text-gray-400"
          onClick={async () => {
            const result = await startBot({ id: botId });
            if (result) {
              setCurrentStatus(true);
            } else {
              toast.error("Telegram bot could not be started");
            }
          }}
        >
          Run
        </button>
        <button
          disabled={isStopping || isStarting}
          hidden={currentStatus === false}
          className="text-indigo-600 hover:text-indigo-900 disabled:text-gray-400"
          onClick={async () => {
            const result = await stopBot({ id: botId });
            if (result) {
              setCurrentStatus(false);
            } else {
              toast.error("Telegram bot could not be stopped");
            }
          }}
        >
          Stop
        </button>
      </div>
    </>
  );
}
