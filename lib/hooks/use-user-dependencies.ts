"use client"

import { useQuery } from "@tanstack/react-query"
import { authApi } from "@/lib/api/auth"

export function useUserDependencies() {
  return useQuery({
    queryKey: ["user-dependencies"],
    queryFn: () => authApi.getUserDependencies(),
    staleTime: 1000 * 60 * 5, // 5 minutes
    retry: 2,
  })
}
