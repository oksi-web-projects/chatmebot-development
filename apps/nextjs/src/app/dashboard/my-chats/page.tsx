import Link from "next/link";
import { redirect } from "next/navigation";

import { auth } from "@chatmebot/auth";

import { Container } from "~/components/Container";
import { MyChats } from "~/components/MyChats";

export default async function ChatPage() {
  const session = await auth();
  if (!session?.user) {
    return redirect("/login");
  }

  return (
    <>
      <Container className="pb-32 pt-8 text-center">
        <div className="mx-auto max-w-2xl text-center">
          <div className="px-4 sm:px-6 lg:px-8">
            <div className="sm:flex sm:items-center">
              <div className="sm:flex-auto">
                <h1 className="text-base font-semibold leading-6 text-gray-900">
                  My Chats
                </h1>
                <p className="mt-2 text-sm text-gray-700">
                  A list of all the users in your account including their name,
                  title, email and role.
                </p>
              </div>
              <div className="mt-4 sm:ml-16 sm:mt-0 sm:flex-none">
                <Link
                  href="/dashboard/my-chats/create"
                  className="block rounded-md bg-indigo-600 px-3 py-2 text-center text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                >
                  Add chat
                </Link>
              </div>
            </div>
            <div className="mt-8 flow-root">
              <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
                <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
                  <MyChats />
                </div>
              </div>
            </div>
          </div>
        </div>
      </Container>
    </>
  );
}
