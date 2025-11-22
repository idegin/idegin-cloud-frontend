import { apiClient } from "@/lib/api-client"

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

export interface MonthlyRevenue {
  month: string
  revenue: number
  transactions: number
}

export interface PlatformOverview {
  metrics: PlatformMetrics
  revenueData: MonthlyRevenue[]
  year: number
}

export const systemApi = {
  getOverview: async (year?: number) => {
    const params = year ? { year } : {}
    const response = await apiClient.get<{ success: boolean; data: PlatformOverview }>(
      "/system/overview",
      { params }
    )
    return response.data.data
  },
}
