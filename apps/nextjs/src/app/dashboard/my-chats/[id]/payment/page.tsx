
import Link from "next/link";
import { redirect } from "next/navigation";

import { auth } from "@chatmebot/auth";
import { prisma } from "@chatmebot/db";

import { ChatPaymentButton } from "~/components/ChatPaymentButton";
import { Container } from "~/components/Container";

export default async function ChatPaymentPage({
  params,
}: {
  params: { id: string };
}) {
  const session = await auth();
  if (!session?.user) {
    return redirect("/login");
  }

  const id: string = params.id;

  const chat = await prisma.chat.findUnique({
    where: {
      id: id,
      userId: session.user.id,
    },
  });

  const products = await prisma.product.findMany({
    where: {
      id: {
        in: ["chat-1", "chat-2", "chat-3"],
      },
    },
    orderBy: {
      id: "asc",
    },
  });

  if (!chat) {
    return (
      <>
        <Container className="pb-32 pt-8 text-center">
          <div className="mx-auto max-w-2xl">
            <div className="text-left">
              <Link
                className="rounded-md bg-white px-2.5 py-1.5 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
                href="/dashboard/my-chats"
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
      <Container className=" pt-8 text-center">
        <div className="mx-auto max-w-2xl">
          <div className="text-left">
            <Link
              className="rounded-md bg-white px-2.5 py-1.5 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
              href="/dashboard/my-chats"
            >
              Back
            </Link>
          </div>
          <div className="mt-8 space-y-12 sm:space-y-16">
            <div>
              <h1 className="text-lg font-semibold leading-7 text-gray-900 text-green-500">
                Payment chat
              </h1>
              <p className="mt-1 max-w-2xl text-sm leading-6 text-gray-600">
                We'll always let you know about important changes, but you pick
                what else you want to hear about.
              </p>
            </div>
          </div>
          <div className="mt-8">
            <p>{JSON.stringify(chat, null, 2)}</p>
          </div>
        </div>
      </Container>
      <Container className="pb-32 pt-8 text-center">
        <div className="isolate mx-auto mt-10 grid max-w-md grid-cols-1 gap-8 lg:mx-0 lg:max-w-none lg:grid-cols-3">
          {/* <div className="rounded-3xl p-8 ring-1 ring-gray-200 xl:p-10">
            <h3
              id="tier-startup"
              className="text-lg font-semibold leading-8 text-gray-900"
            >
              Free
            </h3>
            <p className="mt-4 text-sm leading-6 text-gray-600">
              A plan that scales with your rapidly growing business.
            </p>
            <p className="mt-8 flex items-baseline justify-center gap-x-1">
              <span className="text-4xl font-bold tracking-tight text-gray-900">
                €0
              </span>
            </p>
            <a
              href="#"
              aria-describedby="tier-freelancer"
              className="mt-8 block rounded-md px-3 py-2 text-center text-sm font-semibold leading-6 text-indigo-600 ring-1 ring-inset ring-indigo-200 hover:ring-indigo-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
            >
              Get free
            </a>
            <ul
              role="list"
              className="mt-8 space-y-3 text-sm leading-6 text-gray-600 xl:mt-10"
            >
              <li className="flex gap-x-3">
                <svg
                  className="h-6 w-5 flex-none text-indigo-600"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  aria-hidden="true"
                >
                  <path
                    fillRule="evenodd"
                    d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z"
                    clipRule="evenodd"
                  />
                </svg>
                25 products
              </li>
              <li className="flex gap-x-3">
                <svg
                  className="h-6 w-5 flex-none text-indigo-600"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  aria-hidden="true"
                >
                  <path
                    fillRule="evenodd"
                    d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z"
                    clipRule="evenodd"
                  />
                </svg>
                Up to 10,000 subscribers
              </li>
              <li className="flex gap-x-3">
                <svg
                  className="h-6 w-5 flex-none text-indigo-600"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  aria-hidden="true"
                >
                  <path
                    fillRule="evenodd"
                    d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z"
                    clipRule="evenodd"
                  />
                </svg>
                Advanced analytics
              </li>
              <li className="flex gap-x-3">
                <svg
                  className="h-6 w-5 flex-none text-indigo-600"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  aria-hidden="true"
                >
                  <path
                    fillRule="evenodd"
                    d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z"
                    clipRule="evenodd"
                  />
                </svg>
                24-hour support response time
              </li>
              <li className="flex gap-x-3">
                <svg
                  className="h-6 w-5 flex-none text-indigo-600"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  aria-hidden="true"
                >
                  <path
                    fillRule="evenodd"
                    d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z"
                    clipRule="evenodd"
                  />
                </svg>
                Marketing automations
              </li>
            </ul>
          </div> */}
          {products.map((product) => (
            <>
              <div className="rounded-3xl p-8 ring-1 ring-gray-200 xl:p-10">
                <h3
                  id="tier-startup"
                  className="text-lg font-semibold leading-8 text-gray-900"
                >
                  {product.name}
                </h3>
                <p className="mt-4 text-sm leading-6 text-gray-600">
                  A plan that scales with your rapidly growing business.
                </p>
                <p className="mt-8 flex items-baseline justify-center gap-x-1">
                  <span className="text-4xl font-bold tracking-tight text-gray-900">
                    €{product.price}
                  </span>
                </p>
                <ChatPaymentButton
                  className="mt-8 block w-full rounded-md bg-indigo-600 px-3 py-2 text-center text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                  chatId={id}
                  productId={product.id}
                >
                  Buy plan
                </ChatPaymentButton>
                <ul
                  role="list"
                  className="mt-8 space-y-3 text-sm leading-6 text-gray-600 xl:mt-10"
                >
                  <li className="flex gap-x-3">
                    <svg
                      className="h-6 w-5 flex-none text-indigo-600"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                      aria-hidden="true"
                    >
                      <path
                        fillRule="evenodd"
                        d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z"
                        clipRule="evenodd"
                      />
                    </svg>
                    25 products
                  </li>
                  <li className="flex gap-x-3">
                    <svg
                      className="h-6 w-5 flex-none text-indigo-600"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                      aria-hidden="true"
                    >
                      <path
                        fillRule="evenodd"
                        d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z"
                        clipRule="evenodd"
                      />
                    </svg>
                    Up to 10,000 subscribers
                  </li>
                  <li className="flex gap-x-3">
                    <svg
                      className="h-6 w-5 flex-none text-indigo-600"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                      aria-hidden="true"
                    >
                      <path
                        fillRule="evenodd"
                        d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z"
                        clipRule="evenodd"
                      />
                    </svg>
                    Advanced analytics
                  </li>
                  <li className="flex gap-x-3">
                    <svg
                      className="h-6 w-5 flex-none text-indigo-600"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                      aria-hidden="true"
                    >
                      <path
                        fillRule="evenodd"
                        d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z"
                        clipRule="evenodd"
                      />
                    </svg>
                    24-hour support response time
                  </li>
                  <li className="flex gap-x-3">
                    <svg
                      className="h-6 w-5 flex-none text-indigo-600"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                      aria-hidden="true"
                    >
                      <path
                        fillRule="evenodd"
                        d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z"
                        clipRule="evenodd"
                      />
                    </svg>
                    Marketing automations
                  </li>
                </ul>
              </div>
            </>
          ))}
        </div>
      </Container>
    </>
  );
}
