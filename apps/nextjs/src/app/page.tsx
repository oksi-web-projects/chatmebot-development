import { Suspense } from "react";

import { auth } from "@chatmebot/auth";

import { SignIn, SignOut } from "~/components/auth";
import { CallToAction } from "~/components/CallToAction";
import { Faqs } from "~/components/Faqs";
import { Hero } from "~/components/Hero";
import { Pricing } from "~/components/Pricing";
import { PrimaryFeatures } from "~/components/PrimaryFeatures";
import { SecondaryFeatures } from "~/components/SecondaryFeatures";
import { Testimonials } from "~/components/Testimonials";

// import { CreatePostForm, PostList } from "./posts";

export default async function HomePage() {
  // const session = await auth();
  return (
    <>
      <Hero />
      <PrimaryFeatures />
      <SecondaryFeatures />
      <CallToAction />
      <Testimonials />
      <Pricing />
      <Faqs />
    </>
    // <main className="flex h-screen flex-col items-center bg-gradient-to-b from-[#2e026d] to-[#15162c] text-white">
    //   <div className="container mt-12 flex flex-col items-center justify-center gap-4 px-4 py-8">
    //     <h1 className="text-5xl font-extrabold tracking-tight sm:text-[5rem]">
    //       Create <span className="text-pink-400">Chatmebot</span>
    //     </h1>
    //     <AuthShowcase />
    //     <Button href="/sadasd" color="blue">
    //       test
    //     </Button>
    //     <CreatePostForm />
    //     <Suspense fallback={<span>Loading...</span>}>
    //       <PostList />
    //     </Suspense>
    //   </div>
    // </main>
  );
}

async function AuthShowcase() {
  const session = await auth();

  if (!session) {
    return (
      <>
        <CallToAction />
        <SignIn
          provider="google"
          className="rounded-full bg-white/10 px-10 py-3 font-semibold text-white no-underline transition hover:bg-white/20"
        >
          Sign in with Google
        </SignIn>
        <SignIn
          provider="facebook"
          className="rounded-full bg-white/10 px-10 py-3 font-semibold text-white no-underline transition hover:bg-white/20"
        >
          Sign in with Facebook
        </SignIn>
      </>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center gap-4">
      <p className="text-center text-2xl text-white">
        {session && <span>Logged in as {session.user.name}</span>}
      </p>

      <SignOut className="rounded-full bg-white/10 px-10 py-3 font-semibold text-white no-underline transition hover:bg-white/20">
        Sign out
      </SignOut>
    </div>
  );
}
