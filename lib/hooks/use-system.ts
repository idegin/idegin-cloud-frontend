"use client"

import { useQuery } from "@tanstack/react-query"
import { systemApi } from "@/lib/api/system"

export function usePlatformOverview(year?: number) {
  return useQuery({
    queryKey: ["platform-overview", year],
    queryFn: () => systemApi.getOverview(year),
  })
}
