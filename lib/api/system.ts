import { apiClient } from "@/lib/api-client"

export type TimePeriod = "week" | "month" | "year" | "all";

export interface PlatformMetrics {
  totalOrganizations: number
  totalProjects: number
  totalRevenue: number
  activeSubscriptions: number
  organizationsGrowth: number
  projectsGrowth: number
  revenueGrowth: number
  subscriptionsGrowth: number
}

export interface RevenueData {
  period: string
  revenue: number
  transactions: number
}

export interface PlatformOverview {
  metrics: PlatformMetrics
  revenueData: RevenueData[]
  period: TimePeriod
}

export const systemApi = {
  getOverview: async (period: TimePeriod = "year") => {
    const response = await apiClient.get<{ success: boolean; data: PlatformOverview }>(
      "/system/overview",
      { params: { period } }
    )
    return response.data.data
  },
}
