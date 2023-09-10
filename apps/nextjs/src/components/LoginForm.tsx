"use client";

import { useState } from "react";
import type { ComponentProps } from "react";

import { api } from "~/utils/api";

export default function LoginForm() {
  const context = api.useContext();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const { mutateAsync: registerUser, error } = api.user.register.useMutation({
    async onSuccess() {
      setEmail("");
      setPassword("");
      // await context.user.register.invalidate();
    },
  });

  return (
    <form
      className="flex w-full max-w-2xl flex-col p-4"
      onSubmit={async (e) => {
        e.preventDefault();
        await registerUser({
          email,
          password,
        });
        setEmail("");
        setPassword("");
        // await context.user.register.invalidate();
      }}
    >
      <input
        className="mb-2 rounded bg-white/10 p-2 text-white"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Login"
      />
      {error?.data?.zodError?.fieldErrors.email && (
        <span className="mb-2 text-red-500">
          {error.data.zodError.fieldErrors.email}
        </span>
      )}
      <input
        className="mb-2 rounded bg-white/10 p-2 text-white"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Password"
      />
      {error?.data?.zodError?.fieldErrors.password && (
        <span className="mb-2 text-red-500">
          {error.data.zodError.fieldErrors.password}
        </span>
      )}
      <button type="submit" className="rounded bg-pink-400 p-2 font-bold">
        Create
      </button>
    </form>
  );
}
