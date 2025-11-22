import apiClient from "../api-client"
import type { User, ApiResponse } from "../types"
import type { UserDependencies } from "../types/user-dependencies"

export interface LoginCredentials {
  email: string
  password: string
}

export interface RegisterData {
  email: string
  name: string
  password: string
  role?: "client" | "super_admin"
}

export interface AuthResponse {
  user: User
  accessToken: string
  refreshToken: string
}

export const authApi = {
  login: async (credentials: LoginCredentials) => {
    const response = await apiClient.post<ApiResponse<AuthResponse>>("/auth/login", credentials)
    return response.data.data
  },

  register: async (data: RegisterData) => {
    const response = await apiClient.post<ApiResponse<AuthResponse>>("/auth/register", data)
    return response.data.data
  },

  logout: async () => {
    const response = await apiClient.post("/auth/logout")
    return response.data
  },

  getProfile: async () => {
    const response = await apiClient.get<ApiResponse<User>>("/auth/profile")
    return response.data.data
  },

  updateProfile: async (data: Partial<User>) => {
    const response = await apiClient.put<ApiResponse<User>>("/auth/profile", data)
    return response.data.data
  },

  changePassword: async (currentPassword: string, newPassword: string) => {
    const response = await apiClient.put("/auth/change-password", {
      currentPassword,
      newPassword,
    })
    return response.data
  },

  requestPasswordReset: async (email: string) => {
    const response = await apiClient.post("/auth/request-password-reset", { email })
    return response.data
  },

  resetPassword: async (token: string, newPassword: string) => {
    const response = await apiClient.post("/auth/reset-password", {
      token,
      newPassword,
    })
    return response.data
  },

  getUserDependencies: async () => {
    const response = await apiClient.get<ApiResponse<UserDependencies>>("/auth/dependencies")
    return response.data.data
  },
}
