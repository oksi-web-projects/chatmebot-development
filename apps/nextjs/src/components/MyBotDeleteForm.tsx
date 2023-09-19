"use client";

import type { ChangeEvent, FormEvent } from "react";
import { useState } from "react";
import { toast } from "react-toastify";

import { api } from "~/utils/api";

export default function MyBotDeleteForm({ botId }: { botId: string }) {
  const { mutateAsync, error, isLoading } = api.bot.delete.useMutation();

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      await mutateAsync(botId);
      toast.success("Chatbot created successfully!");
      window.location.href = "/dashboard/my-bots";
    } catch (error) {
      // Show an error toast when there is an error
      toast.error("An error occurred while creating the chatbot.");
    }
  };

  return (
    <>
      <form
        className="flex w-full max-w-2xl flex-col p-4 text-left"
        onSubmit={handleSubmit}
      >
        <div className="flex justify-center">
          <button
            type="submit"
            disabled={isLoading}
            className="block w-48 rounded-md bg-white px-2.5 py-1.5 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
          >
            {isLoading ? "Deleting..." : "Confirm Delete"}
          </button>
        </div>
      </form>
    </>
  );
}
