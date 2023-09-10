import { redirect } from "next/navigation";

import { auth } from "@chatmebot/auth";

import { Products } from "~/components/Products";

export default async function ProductsPage() {
  const session = await auth();
  if (!session?.user) {
    return redirect("/login");
  }
  return (
    <>
      <Products />
    </>
  );
}
