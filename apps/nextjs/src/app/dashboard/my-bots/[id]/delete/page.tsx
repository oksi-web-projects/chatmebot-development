import { notFound, redirect } from "next/navigation";
import { ToastContainer } from "react-toastify";

import { auth } from "@chatmebot/auth";
import { prisma } from "@chatmebot/db";

import "react-toastify/dist/ReactToastify.css";

import Link from "next/link";

import { api } from "~/utils/api";
import { Container } from "~/components/Container";
import MyBotDeleteForm from "~/components/MyBotDeleteForm";

export default async function BotDeletePage({
  params,
}: {
  params: { id: string };
}) {
  const session = await auth();
  if (!session?.user) {
    return redirect("/login");
  }

  const id: string = params.id;

  const telegramBot = await prisma.telegramBot.findUnique({
    where: {
      id: id,
      userId: session.user.id,
    },
  });

  if (!telegramBot) {
    return (
      <>
        <Container className="pb-32 pt-8 text-center">
          <div className="mx-auto max-w-2xl">
            <div className="text-left">
              <Link
                className="rounded-md bg-white px-2.5 py-1.5 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
                href="/dashboard/my-bots"
              >
                Back
              </Link>
            </div>
            <div className="mt-8 space-y-12 sm:space-y-16">
              <div>
                <h1 className="text-lg font-semibold leading-7 text-gray-900">
                  Bot Not Found
                </h1>
              </div>
            </div>
          </div>
        </Container>
      </>
    );
  }

  return (
    <>
      <Container className="pb-32 pt-8 text-center">
        <div className="mx-auto max-w-2xl">
          <div className="text-left">
            <Link
              className="rounded-md bg-white px-2.5 py-1.5 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
              href="/dashboard/my-bots"
            >
              Back
            </Link>
          </div>
          <div className="mt-8 space-y-12 sm:space-y-16">
            <div>
              <h1 className="text-lg font-semibold leading-7 text-gray-900 text-red-500">
                Delete Bot
              </h1>
              <p className="mt-1 max-w-2xl text-sm leading-6 text-gray-600">
                We'll always let you know about important changes, but you pick
                what else you want to hear about.
              </p>
            </div>
          </div>
          <div className="mt-8">
            <p>{JSON.stringify(telegramBot, null, 2)}</p>
          </div>
          <MyBotDeleteForm botId={telegramBot.id} />
        </div>
      </Container>
    </>
  );
}
