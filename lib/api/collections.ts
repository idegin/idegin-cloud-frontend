import apiClient from "../api-client"

export interface Collection {
  id: string
  slug: string
  name: string
  description?: string
  createdById: string
  projectId: string
  createdAt: string
  updatedAt: string
  _count?: {
    schemas: number
    fields: number
    entries: number
  }
}

export const collectionsApi = {
  getByProject: async (projectId: string) => {
    const response = await apiClient.get(`/cms/${projectId}/collections`)
    return response.data as { success: boolean; message: string; data: Collection[] }
  },

  getById: async (projectId: string, collectionId: string) => {
    const response = await apiClient.get(`/cms/${projectId}/collections/${collectionId}`)
    return response.data as { success: boolean; message: string; data: Collection }
  },

  create: async (projectId: string, data: { name: string; description?: string }) => {
    const response = await apiClient.post(`/cms/${projectId}/collections`, data)
    return response.data as { success: boolean; message: string; data: Collection }
  },

  update: async (projectId: string, collectionId: string, data: { name?: string; description?: string }) => {
    const response = await apiClient.put(`/cms/${projectId}/collections/${collectionId}`, data)
    return response.data as { success: boolean; message: string; data: Collection }
  },

  delete: async (projectId: string, collectionId: string) => {
    const response = await apiClient.delete(`/cms/${projectId}/collections/${collectionId}`)
    return response.data as { success: boolean; message: string; data: null }
  },
}
