"use client"

import { useQuery } from "@tanstack/react-query"
import { systemApi, TimePeriod } from "@/lib/api/system"

export function usePlatformOverview(period: TimePeriod = "year") {
  return useQuery({
    queryKey: ["platform-overview", period],
    queryFn: () => systemApi.getOverview(period),
  })
}
