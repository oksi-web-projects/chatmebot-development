import { Suspense } from "react";
import { redirect } from "next/navigation";

import { auth } from "@chatmebot/auth";

import { SignIn, SignOut } from "~/components/auth";
import { CallToAction } from "~/components/CallToAction";
import { Container } from "~/components/Container";
import LoginForm from "~/components/LoginForm";

export default function LoginPage() {
  return <AuthShowcase />;
}

async function AuthShowcase() {
  const session = await auth();

  if (session) {
    return redirect("/dashboard");
  }

  return (
    <>
      <Container className="pb-32 pt-8 text-center">
        <div className="mx-auto max-w-2xl text-center">
          <h1 className="text-2xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            Sign In
          </h1>
          <p className="mt-6 text-gray-600">
            Anim aute id magna aliqua ad ad non deserunt sunt. Qui irure qui
            lorem cupidatat commodo. Elit sunt amet fugiat veniam occaecat
            fugiat aliqua.
          </p>
        </div>
        <div className="mt-8 flex flex-col items-center justify-center gap-4">
          <div>
            
            <SignIn
              provider="google"
              className="rounded-full bg-white px-4 py-2.5 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
              
            >
              Sign in with Google
            </SignIn>
          </div>
          <div>
            <SignIn
              provider="facebook"
              className="rounded-full bg-white px-4 py-2.5 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
            >
              Sign in with Facebook
            </SignIn>
          </div>
        </div>
      </Container>
    </>
  );
}
