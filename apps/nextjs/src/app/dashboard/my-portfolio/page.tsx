import Link from "next/link";

import authGuard from "~/components/authGuard";
import { MyInstagram } from "~/components/MyInstagram";

export default async function PortfolioPage() {
  await authGuard();

  return (
    <>
      <MyInstagram />
    </>
  );
}
