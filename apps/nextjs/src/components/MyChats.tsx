"use client";

import Link from "next/link";

import { api } from "~/utils/api";
import { Container } from "~/components/Container";

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
              <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-center text-sm font-medium sm:pr-0">
                <Link href={`/chat/${chat.id}`}>{chat.id}</Link>
              </td>
              <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-0">
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
