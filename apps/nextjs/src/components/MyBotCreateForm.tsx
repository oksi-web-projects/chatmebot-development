"use client";

import { useState } from "react";

import { api } from "~/utils/api";
import { Container } from "~/components/Container";

export default function MyBotCreateForm() {
  const context = api.useContext();

  const [token, setToken] = useState("");

  const { mutateAsync: createBot, error } = api.bot.create.useMutation({
    async onSuccess() {
      setToken("");
      await context.bot.all.invalidate();
    },
  });

  return (
    <>
      <form
        className="flex w-full max-w-2xl flex-col p-4 text-left"
        onSubmit={async (e) => {
          e.preventDefault();
          await createBot({
            token,
          });
          setToken("");
          await context.bot.all.invalidate();
        }}
      >
        <div className="mt-4 border-t border-gray-900/10 pt-4">
          <label
            htmlFor="first-name"
            className="block text-left text-sm font-medium leading-6 text-gray-900"
          >
            Token
          </label>
          <div className="mt-2">
            <input
              value={token}
              onChange={(e) => setToken(e.target.value)}
              placeholder="token"
              className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
            />
          </div>
          {error?.data?.zodError?.fieldErrors.token && (
            <span className="mb-8 text-red-500">
              {error.data.zodError.fieldErrors.token}
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
          <button
            type="submit"
            className="inline-flex justify-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
          >
            Save
          </button>
        </div>
      </form>
    </>
  );
}
