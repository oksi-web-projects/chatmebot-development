import Link from "next/link";
import { redirect } from "next/navigation";

import { auth } from "@chatmebot/auth";

import Button from "~/components/Button";
import { Container } from "~/components/Container";

export default async function DashboardPage() {
  const session = await auth();
  if (!session?.user) {
    return redirect("/login");
  }
  return (
    <>
      <Container className="pb-32 pt-8 text-center">
        <div className="mx-auto max-w-2xl text-center">
          <h1 className="text-2xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            Dashboard
          </h1>
          <p className="mt-6 text-center text-2xl ">
            {session && <span>Logged in as {session.user.name}</span>}
          </p>
          <p className="mt-6 text-gray-600">
            Anim aute id magna aliqua ad ad non deserunt sunt. Qui irure qui
            lorem cupidatat commodo. Elit sunt amet fugiat veniam occaecat
            fugiat aliqua.
          </p>
          <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-4">
            <Link
              className="flex h-32 items-center justify-center rounded-md border bg-gray-100 px-6 py-3 text-center  font-medium  shadow-sm hover:bg-gray-500"
              href="/dashboard/my-chats"
            >
              My Chats
            </Link>
            <Link
              className="flex h-32 items-center justify-center rounded-md border bg-gray-100 px-6 py-3 text-center  font-medium  shadow-sm hover:bg-gray-500"
              href="/dashboard/my-bots"
            >
              My Telegram Bots
            </Link>
          </div>
        </div>
      </Container>
    </>
  );
}
