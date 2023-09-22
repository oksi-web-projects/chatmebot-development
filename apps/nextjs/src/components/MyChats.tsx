"use client";

import Link from "next/link";
import moment from "moment";

import { api } from "~/utils/api";
import { Container } from "~/components/Container";

const getStatus = (chat: any) => {
  const { expires, id } = chat;
  if (!expires) {
    return (
      <>
        <div>free</div>
      </>
    );
  }

  return (
    <>
      <div className="flex items-center gap-2">
        {moment().isBefore(expires) ? (
          <div className="h-2 w-2 rounded bg-green-400"></div>
        ) : (
          <div className="h-2 w-2 rounded bg-red-400"></div>
        )}
        <div className="text-xs">{moment(expires).format("YYYY-MM-DD")}</div>
        <Link
          href={`/dashboard/my-chats/${chat.id}/payment`}
          className="rounded-full bg-white px-2.5 py-1 text-xs font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
        >
          Payment
        </Link>
      </div>
    </>
  );
};

export function MyChats() {
  const { data: chats, isLoading } = api.chat.all.useQuery();

  if (isLoading) {
    return <>Loading...</>;
  }

  console.log(chats);

  return (
    <>
      <table className="min-w-full divide-y divide-gray-300">
        <thead>
          <tr>
            <th
              scope="col"
              className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-0"
            >
              Name
            </th>
            <th
              scope="col"
              className="px-3 py-3.5 text-sm font-semibold text-gray-900"
            >
              Link
            </th>
            <th
              scope="col"
              className="px-3 py-3.5 text-sm font-semibold text-gray-900"
            >
              expire
            </th>
            <th scope="col" className="relative py-3.5 pl-3 pr-4 sm:pr-0">
              <span className="sr-only">Edit</span>
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {chats.map((chat) => (
            <tr key={chat.id}>
              <td className="whitespace-nowrap py-4 pl-4 pr-3 text-left text-sm font-medium text-gray-900 sm:pl-0">
                {chat.name}
              </td>
              <td className="relative justify-center whitespace-nowrap px-3 py-4 text-center text-sm font-medium">
                <Link
                  className="rounded bg-white px-2 py-1 text-xs font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
                  href={`/chat/${chat.id}`}
                >
                  open chat
                </Link>
              </td>
              <td className="relative flex justify-center whitespace-nowrap px-3 py-4 text-center text-sm font-medium">
                {getStatus(chat)}
              </td>
              <td className="relative whitespace-nowrap px-3 py-4 text-center text-sm font-medium">
                <a href="#" className="text-indigo-600 hover:text-indigo-900">
                  Edit<span className="sr-only">, {chat.id}</span>
                </a>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
}
