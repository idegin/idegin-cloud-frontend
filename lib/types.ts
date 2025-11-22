export type UserRole = "super_admin" | "client"

export interface User {
  _id: string
  email: string
  name: string
  role: UserRole
  stripeCustomerId?: string
  createdAt: string
  updatedAt: string
}

export interface Project {
  _id: string
  clientId: string
  name: string
  description?: string
  status: "active" | "inactive" | "pending" | "completed" | "archived"
  priority: "low" | "medium" | "high" | "critical"
  startDate: string
  endDate?: string
  budget?: number
  technologies?: string[]
  repositoryUrl?: string
  liveUrl?: string
  createdAt: string
  updatedAt: string
}

export interface HostingPlan {
  _id: string
  projectId: string
  flyAppId: string
  flyAppName: string
  domain?: string
  status: "active" | "paused" | "cancelled"
  subscriptionId: string
  currentPeriodEnd: string
  plan: "basic" | "pro" | "enterprise"
  createdAt: string
  updatedAt: string
}

export interface Invoice {
  _id: string
  clientId: string
  hostingPlanId: string
  stripeInvoiceId: string
  amount: number
  status: "paid" | "pending" | "failed"
  periodStart: string
  periodEnd: string
  createdAt: string
}

export interface ApiResponse<T> {
  success: boolean
  data: T
  message?: string
}

export interface PaginatedResponse<T> {
  success: boolean
  data: T[]
  pagination: {
    page: number
    limit: number
    total: number
    pages: number
  }
}

export type { UserDependencies } from "./types/user-dependencies"
