import apiClient from "../api-client"
import type { ApiResponse, PaginatedResponse } from "../types"

export interface Organization {
  id: string
  name: string
  slug: string
  ownerId: string
  createdAt: string
  updatedAt: string
  owner?: {
    id: string
    name: string
    email: string
  }
  _count?: {
    projects: number
    organizationUsers: number
  }
}

export interface OrganizationUser {
  id: string
  userId: string
  organizationId: string
  status: "pending" | "active" | "suspended"
  createdAt: string
  updatedAt: string
  user: {
    id: string
    name: string
    email: string
    role: string
    isEmailVerified: boolean
  }
}

export interface OrganizationProject {
  id: string
  projectName: string
  description: string
  status: "active" | "in_dev" | "suspended"
  monthly_billing: number
  is_payment_active: boolean
  createdAt: string
  updatedAt: string
  providers: Array<{
    id: string
    type: string
    config: any
  }>
  _count: {
    projectMembers: number
  }
}

export interface OrganizationInvitation {
  id: string
  email: string
  type: string
  status: string
  token: string
  expiresAt: string
  createdAt: string
  invitedBy: {
    id: string
    name: string
    email: string
  }
}

export interface OrganizationTransaction {
  id: string
  amount: number
  type: string
  status: string
  description: string
  reference?: string | null
  createdAt: string
}

export interface OrganizationWallet {
  id: string
  balance: number
  outstanding_balance: number
  organizationId: string
  createdAt: string
  updatedAt: string
  transactions: OrganizationTransaction[]
  totalTransactions: number
}

export interface OrganizationDetails {
  organization: Organization & {
    owner: {
      id: string
      name: string
      email: string
      role: string
      isEmailVerified: boolean
      createdAt: string
    }
    organizationUsers: OrganizationUser[]
    projects: OrganizationProject[]
    invitations?: OrganizationInvitation[]
    _count: {
      projects: number
      organizationUsers: number
      invitations: number
    }
  }
  wallet: OrganizationWallet | null
  statistics: {
    totalProjects: number
    totalUsers: number
    pendingInvitations: number
    projectsByStatus: Record<string, number>
    totalSpending: number
  }
}

export interface OrganizationFilters {
  page?: number
  limit?: number
  search?: string
  status?: string
}

export const organizationsApi = {
  getAll: async (filters?: OrganizationFilters) => {
    const response = await apiClient.get<ApiResponse<Organization[]>>("/organizations", {
      params: filters,
    })
    return response.data
  },

  getById: async (id: string) => {
    const response = await apiClient.get<ApiResponse<OrganizationDetails>>(`/organizations/${id}/details`)
    return response.data.data
  },

  create: async (data: { name: string }) => {
    const response = await apiClient.post<ApiResponse<Organization>>("/organizations", data)
    return response.data.data
  },

  update: async (id: string, data: { name?: string }) => {
    const response = await apiClient.put<ApiResponse<Organization>>(`/organizations/${id}`, data)
    return response.data.data
  },
}
