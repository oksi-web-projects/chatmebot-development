import { redirect } from "next/navigation";

import { auth } from "@chatmebot/auth";

import Button from "~/components/Button";
import { Container } from "~/components/Container";

export default async function PaymentResultPage() {
  const session = await auth();
  if (!session?.user) {
    return redirect("/login");
  }
  return (
    <>
      <Container className="pb-32 pt-8 text-center">
        <div className="mx-auto max-w-2xl text-center">
          <h1 className="text-2xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            Payment Procesed
          </h1>
          <p className="mt-6 text-gray-600">Thx for your payment</p>
          <div className="mt-6">
            <Button href="/dashboard/my-orders">My Orders</Button>
          </div>
        </div>
      </Container>
    </>
  );
}
