import { notFound } from "next/navigation";

import { prisma } from "@chatmebot/db";

import { Chat } from "~/components/Chat";
import { Container } from "~/components/Container";

export default async function ChatPage({ params }: { params: { id: string } }) {
  const id: string = params.id;

  const chat = await prisma.chat.findUnique({
    where: {
      id: id,
    },
  });

  if (!chat) {
    notFound();
  }

  return (
    <>
      <Container className="pb-32 pt-8 text-center">
        <div className="mx-auto max-w-2xl text-center">
          <h1 className="text-2xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            Chat
          </h1>
          <p className="mt-6 text-gray-600">
            Anim aute id magna aliqua ad ad non deserunt sunt. Qui irure qui
            lorem cupidatat commodo. Elit sunt amet fugiat veniam occaecat
            fugiat aliqua.
          </p>
          <div className="mt-6">
            {chat.expires === null || chat?.expires > new Date() ? (
              <Chat chatId={id} />
            ) : (
              <>
                <div>
                  <h1 className="text-lg font-semibold leading-7 text-gray-900">
                    Chat expired
                  </h1>
                </div>
              </>
            )}
          </div>
        </div>
      </Container>
    </>
  );
}
