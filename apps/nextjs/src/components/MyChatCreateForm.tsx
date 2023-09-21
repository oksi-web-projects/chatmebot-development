"use client";

import type { ChangeEvent, FormEvent } from "react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";

import { api } from "~/utils/api";
import Button from "./Button";

export default function MyChatCreateForm() {
  const router = useRouter();
  const [chatName, setChatName] = useState("");
  const { mutateAsync, error, isLoading } = api.chat.create.useMutation();

  console.log(error, "error test");
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const result = await mutateAsync({ name: chatName });
      toast.success("Chatbot created successfully!");
      setChatName("");
      if (result.expires == null) {
        window.location.href = `/dashboard/my-chats`;
      } else {
        window.location.href = `/dashboard/my-chats/${result.id}/payment`;
      }
    } catch (error) {
      // Show an error toast when there is an error
      toast.error("An error occurred while creating the chatbot.");
    }
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setChatName(e.target.value);
  };

  if (isLoading) {
    return <div>Loading ...</div>;
  }

  return (
    <>
      <form
        className="flex w-full max-w-2xl flex-col p-4 text-left"
        onSubmit={handleSubmit}
      >
        <div className="mt-4 border-t border-gray-900/10 pt-4">
          <label
            htmlFor="first-name"
            className="block text-left text-sm font-medium leading-6 text-gray-900"
          >
            Name
          </label>
          <div className="mt-2">
            <input
              value={chatName}
              onChange={handleChange}
              className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
            />
          </div>
          {error?.data?.zodError?.fieldErrors.name && (
            <span className="mb-8 text-red-500">
              {error.data.zodError.fieldErrors.name}
            </span>
          )}
        </div>

        <div className="mt-8 flex items-center justify-end gap-x-6 border-t border-gray-900/10 pt-8">
          <button
            type="button"
            className="text-sm font-semibold leading-6 text-gray-900"
          >
            Cancel
          </button>
          <Button
            disabled={chatName.trim() === ""}
            className="inline-flex justify-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
          >
            Save
          </Button>
        </div>
      </form>
    </>
  );
}
