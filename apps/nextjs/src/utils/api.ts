import { createTRPCReact } from "@trpc/react-query";

import type { AppRouter } from "@chatmebot/api";

export const api = createTRPCReact<AppRouter>();

export { type RouterInputs, type RouterOutputs } from "@chatmebot/api";
