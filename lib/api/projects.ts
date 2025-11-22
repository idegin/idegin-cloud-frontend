import apiClient from "../api-client"
import type { ApiResponse } from "../types"

export interface Project {
  id: string
  projectName: string
  description: string
  organizationId: string
  status: "active" | "in_dev" | "suspended"
  monthly_billing: number
  is_payment_active: boolean
  publicKey: string
  secretKey: string
  createdAt: string
  updatedAt: string
  organization?: {
    id: string
    name: string
    slug: string
    owner?: {
      id: string
      name: string
      email: string
    }
  }
  providers?: Array<{
    id: string
    type: "fly.io" | "mortar_studio"
    appName?: string
  }>
  _count?: {
    projectMembers: number
  }
}

export interface CreateProjectData {
  projectName: string
  description: string
  organizationId: string
  monthly_billing: number
  providers: Array<{
    type: "fly.io" | "mortar_studio"
    config: any
  }>
  status?: "active" | "in_dev" | "suspended"
  is_payment_active?: boolean
}

export interface ProjectFilters {
  status?: "active" | "in_dev" | "suspended"
  is_payment_active?: boolean
  client?: string
  provider?: "fly.io" | "mortar_studio"
  search?: string
  page?: number
  limit?: number
}

export interface ProjectsResponse {
  success: boolean
  message: string
  data: {
    items: Project[]
    pagination: {
      page: number
      limit: number
      total: number
      pages: number
      hasNext: boolean
      hasPrev: boolean
    }
  }
}

export interface ProjectFullDetails {
  project: Project
  wallet: {
    id: string
    balance: number
    outstanding_balance: number
    createdAt: string
    updatedAt: string
  } | null
  transactions: Array<{
    id: string
    type: "credit" | "debit"
    amount: number
    description: string
    status: "pending" | "completed" | "failed"
    reference: string
    createdAt: string
  }>
}

export interface ProjectDetailsForClient {
  project: Project & {
    next_billing_date?: string
  }
  wallet: {
    balance: number
    outstanding_balance: number
  } | null
  invoices: Array<{
    id: string
    reference: string
    amount: number
    status: "paid" | "unpaid"
    dueDate: string
    createdAt: string
  }>
}

export const projectsApi = {
  // Get all projects (Super Admin only)
  getAll: async (filters?: ProjectFilters) => {
    const response = await apiClient.get<ProjectsResponse>("/projects", {
      params: filters,
    })
    return response.data
  },

  // Get organization projects (requires x-org-user-id header)
  getOrgProjects: async (filters?: Omit<ProjectFilters, "client" | "provider" | "is_payment_active">) => {
    const response = await apiClient.get<ProjectsResponse>("/projects/org", {
      params: filters,
    })
    return response.data
  },

  getById: async (id: string) => {
    const response = await apiClient.get<ApiResponse<Project>>(`/projects/${id}`)
    return response.data.data
  },

  getFullDetails: async (id: string) => {
    const response = await apiClient.get<ApiResponse<ProjectFullDetails>>(`/projects/${id}/full`)
    return response.data.data
  },

  getDetailsForClient: async (id: string) => {
    const response = await apiClient.get<ApiResponse<ProjectDetailsForClient>>(`/projects/${id}/details`)
    return response.data.data
  },

  create: async (data: CreateProjectData) => {
    const response = await apiClient.post<ApiResponse<Project>>("/projects", data)
    return response.data.data
  },

  update: async (id: string, data: Partial<CreateProjectData>) => {
    const response = await apiClient.put<ApiResponse<Project>>(`/projects/${id}`, data)
    return response.data.data
  },

  delete: async (id: string) => {
    const response = await apiClient.delete(`/projects/${id}`)
    return response.data
  },

  toggleBilling: async (id: string, isActive: boolean) => {
    const response = await apiClient.put<ApiResponse<Project>>(`/projects/${id}`, {
      is_payment_active: isActive
    })
    return response.data.data
  },

  updateStatus: async (id: string, status: "active" | "in_dev" | "suspended") => {
    const response = await apiClient.put<ApiResponse<Project>>(`/projects/${id}`, {
      status: status
    })
    return response.data.data
  },

  getStats: async () => {
    const response = await apiClient.get("/projects/stats")
    return response.data.data
  },
}
