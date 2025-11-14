import { useInfiniteQuery } from "@tanstack/react-query";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { getUserProfile } from "../api/api";

export const useInfiniteUserProfile = (username) => {
  const { auth } = useContext(AuthContext);

  return useInfiniteQuery({
    queryKey: ["userProfile", username],
    queryFn: async ({ pageParam = 1 }) => {
      if (!auth.token || !username) {
        throw new Error("No token or username");
      }
      const response = await getUserProfile(username, auth.token, pageParam);
      return response.data;
    },
    getNextPageParam: (lastPage) => {
      if (!lastPage.pagination?.hasMore) return undefined;
      return lastPage.pagination.page + 1;
    },
    enabled: !!auth.token && !!username,
  });
};
