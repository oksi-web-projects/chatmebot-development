import type { ComponentProps } from "react";

import type { OAuthProviders } from "@chatmebot/auth";
import { CSRF_experimental } from "@chatmebot/auth";

export function SignIn({
  provider,
  ...props
}: { provider: OAuthProviders } & ComponentProps<"button">) {
  return (
    <form
      action={`/api/auth/signin/${provider}?callbackUrl=https://chatmebot-app.vercel.app/dashboard`}
      method="post"
    >
      <button {...props} />
      <CSRF_experimental />
    </form>
  );
}

export function SignOut(props: ComponentProps<"button">) {
  return (
    <form action="/api/auth/signout" method="post">
      <button {...props} />
      <CSRF_experimental />
    </form>
  );
}
