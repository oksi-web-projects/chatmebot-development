import { redirect } from "next/navigation";

import { auth } from "@chatmebot/auth";

interface configInterface {
  session?: string;
}

export default async () => {
  const session = await auth();
  if (!session?.user) {
    return redirect("/login");
  }
};
