"use client";

import { signIn } from "next-auth/react";

// export default () => <button onClick={() => signIn()}>Sign in</button>
// export function SignIn({
//   provider,
//   ...props
// }: { provider: OAuthProviders } & ComponentProps<"button">) {
//   return (
//     <button onClick={() => signIn()}>Sign in</button>

//   );
// }

export function SignOut(props: ComponentProps<"button">) {
  return (
    <form action="/api/auth/signout" method="post">
      <button {...props} />
      <CSRF_experimental />
    </form>
  );
}
