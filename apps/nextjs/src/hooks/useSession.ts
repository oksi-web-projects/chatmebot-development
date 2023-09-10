import { api } from "~/utils/api";

export const useSession = () => {
  const { data: session, isLoading } = api.auth.getSession.useQuery();

  return {
    user: session?.user,
    isLoading,
  };
};
