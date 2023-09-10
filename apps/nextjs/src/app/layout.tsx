import type { Metadata } from "next";
import { Inter } from "next/font/google";

import "~/styles/globals.css";

import { getCsrfToken } from "next-auth/react";

import { auth } from "@chatmebot/auth";

import { Footer } from "~/components/Footer";
import { Header } from "~/components/Header";
import { TRPCReactProvider } from "./providers";

const fontSans = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
});

export const metadata: Metadata = {
  title: "Create T3 Turbo",
  description: "Simple monorepo with shared backend for web & mobile apps",
  openGraph: {
    title: "Create T3 Turbo",
    description: "Simple monorepo with shared backend for web & mobile apps",
    url: "https://create-t3-turbo.vercel.app",
    siteName: "Create T3 Turbo",
  },
  twitter: {
    card: "summary_large_image",
    site: "@jullerino",
    creator: "@jullerino",
  },
};

export default async function Layout(props: { children: React.ReactNode }) {
  const session = await auth();

  const csrfToken = await getCsrfToken();

  return (
    <html lang="en">
      <body className={["font-sans", fontSans.variable].join(" ")}>
        <TRPCReactProvider>
          <Header session={session} csrfToken={csrfToken} />
          <main>{props.children}</main>
          <Footer />
        </TRPCReactProvider>
      </body>
    </html>
  );
}
