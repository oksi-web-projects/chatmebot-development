import { redirect } from "next/navigation";
import { ToastContainer } from "react-toastify";

import "react-toastify/dist/ReactToastify.css";

import { auth } from "@chatmebot/auth";

import { api } from "~/utils/api";
import { Container } from "~/components/Container";
import MyChatCreateForm from "~/components/MyChatCreateForm";

export default async function ChatPage() {
  const session = await auth();
  if (!session?.user) {
    return redirect("/login");
  }

  return (
    <>
      <Container className="pb-32 pt-8 text-center">
        <ToastContainer className="mx-auto max-w-2xl" position="top-center" />
        <div className="mx-auto max-w-2xl">
          <div className="space-y-12 sm:space-y-16">
            <div>
              <h1 className="text-lg font-semibold leading-7 text-gray-900">
                Create chat
              </h1>
              <p className="mt-1 max-w-2xl text-sm leading-6 text-gray-600">
                We'll always let you know about important changes, but you pick
                what else you want to hear about.
              </p>
            </div>
          </div>
          <div className="mt-4">
            <MyChatCreateForm />
          </div>
        </div>
      </Container>
    </>
  );
}
