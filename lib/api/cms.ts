import apiClient from "../api-client"
import type { ApiResponse } from "../types"

export interface CMSCollectionField {
  id: string
  collectionId: string
  schemaId: string
  parentFieldId?: string | null
  indexOrder: string
  defaultBooleanValue: boolean
  defaultStringValue: string
  fieldConfig: {
    label: string
    key: string
    type: string
    placeholder?: string
    helpText?: string
    readonly?: boolean
    hidden?: boolean
  }
  validationRules: any
  configOptions: any
  dropdownOptions: any[]
  relatedCollectionId?: string | null
  createdById: string
  updatedById?: string | null
  createdAt: string
  updatedAt: string
}

export interface CMSSchema {
  id: string
  collectionId: string
  projectId: string
  createdById: string
  updatedById?: string | null
  createdAt: string
  updatedAt: string
  fields: CMSCollectionField[]
  collection: {
    id: string
    name: string
    slug: string
    projectId: string
  }
}

export interface CMSCollection {
  id: string
  name: string
  slug: string
  description?: string
  projectId: string
  createdById: string
  createdBy?: {
    id: string
    name: string
    email: string
  }
  project?: {
    id: string
    projectName: string
  }
  createdAt: string
  updatedAt: string
  schemas?: Array<{
    id: string
    name: string
    fields?: Array<{
      id: string
      fieldConfig: any
      validationRules?: any
      configOptions?: any
    }>
  }>
  _count?: {
    entries: number
  }
}

export interface CreateCollectionData {
  name: string
  description?: string
}

export interface UpdateCollectionData {
  name?: string
  description?: string
}

export interface CollectionFilters {
  search?: string
  page?: number
  limit?: number
}

export interface CMSEntry {
  id: string
  collectionId: string
  data: Record<string, any>
  dataDraft?: Record<string, any>
  published: boolean
  createdAt: string
  updatedAt: string
  collection?: {
    id: string
    name: string
    slug: string
  }
}

export interface CreateEntryData {
  data: Record<string, any>
  published?: boolean
}

export interface UpdateEntryData {
  data?: Record<string, any>
  published?: boolean
}

export interface EntryFilters {
  search?: string
  page?: number
  limit?: number
}

export interface EntriesResponse {
  data: CMSEntry[]
  total: number
  page: number
  totalPages: number
  hasNext: boolean
  hasPrev: boolean
}

export const cmsApi = {
  // Collections endpoints
  collections: {
    getByProject: async (projectId: string, filters?: CollectionFilters) => {
      const response = await apiClient.get<ApiResponse<CMSCollection[]>>(`/cms/${projectId}/collections`, {
        params: filters,
      })
      return response.data.data
    },

    getById: async (projectId: string, collectionId: string) => {
      const response = await apiClient.get<ApiResponse<CMSCollection>>(`/cms/${projectId}/collections/${collectionId}`)
      return response.data.data
    },

    create: async (projectId: string, data: CreateCollectionData) => {
      const response = await apiClient.post<ApiResponse<CMSCollection>>(`/cms/${projectId}/collections`, data)
      return response.data.data
    },

    update: async (projectId: string, collectionId: string, data: UpdateCollectionData) => {
      const response = await apiClient.put<ApiResponse<CMSCollection>>(`/cms/${projectId}/collections/${collectionId}`, data)
      return response.data.data
    },

    delete: async (projectId: string, collectionIds: string | string[]) => {
      const ids = Array.isArray(collectionIds) ? collectionIds.join(',') : collectionIds
      const response = await apiClient.delete(`/cms/${projectId}/collections?ids=${ids}`)
      return response.data
    },
  },

  // Docs endpoints - Generate Documentation for CMS collections
  docs: {
    getTypes: async (projectId: string) => {
      const response = await apiClient.get<ApiResponse<{
        types: string
        format: string
        generatedAt: string
      }>>(`/cms/docs/${projectId}/types`)
      return response.data.data
    },

    getCollectionTypes: async (projectId: string, collectionSlug: string) => {
      const response = await apiClient.get<ApiResponse<{
        types: string
        format: string
        generatedAt: string
      }>>(`/cms/docs/${projectId}/collections/${collectionSlug}/types`)
      return response.data.data
    },
  },

  // Schema endpoints
  schema: {
    get: async (projectId: string, collectionId: string) => {
      const response = await apiClient.get<ApiResponse<CMSSchema>>(`/cms/schema/${projectId}/${collectionId}`)
      return response.data.data
    },

    update: async (projectId: string, collectionId: string, data: {
      toCreate?: any[]
      toUpdate?: any[]
      toDelete?: any[]
    }) => {
      const response = await apiClient.put<ApiResponse<CMSSchema>>(`/cms/schema/${projectId}/${collectionId}`, data)
      return response.data.data
    },
  },

  // Entries endpoints
  entries: {
    getByCollection: async (projectId: string, collectionId: string, filters?: EntryFilters) => {
      const response = await apiClient.get<ApiResponse<EntriesResponse>>(`/cms/${projectId}/collections/${collectionId}/entries`, {
        params: filters,
      })
      return response.data.data
    },

    getById: async (projectId: string, collectionId: string, entryId: string) => {
      const response = await apiClient.get<ApiResponse<CMSEntry>>(`/cms/${projectId}/collections/${collectionId}/entries/${entryId}`)
      return response.data.data
    },

    create: async (projectId: string, collectionId: string, data: CreateEntryData) => {
      const response = await apiClient.post<ApiResponse<CMSEntry>>(`/cms/${projectId}/collections/${collectionId}/entries`, data)
      return response.data.data
    },

    update: async (projectId: string, collectionId: string, entryId: string, data: UpdateEntryData) => {
      const response = await apiClient.put<ApiResponse<CMSEntry>>(`/cms/${projectId}/collections/${collectionId}/entries/${entryId}`, data)
      return response.data.data
    },

    delete: async (projectId: string, collectionId: string, entryIds: string | string[]) => {
      const ids = Array.isArray(entryIds) ? entryIds.join(',') : entryIds
      const response = await apiClient.delete(`/cms/${projectId}/collections/${collectionId}/entries?ids=${ids}`)
      return response.data
    },

    publish: async (projectId: string, collectionId: string, entryId: string) => {
      const response = await apiClient.patch<ApiResponse<CMSEntry>>(`/cms/${projectId}/collections/${collectionId}/entries/${entryId}/publish`)
      return response.data.data
    },

    unpublish: async (projectId: string, collectionId: string, entryId: string) => {
      const response = await apiClient.patch<ApiResponse<CMSEntry>>(`/cms/${projectId}/collections/${collectionId}/entries/${entryId}/unpublish`)
      return response.data.data
    },

    saveDraft: async (projectId: string, collectionId: string, entryId: string, data: Record<string, any>) => {
      const response = await apiClient.patch<ApiResponse<CMSEntry>>(`/cms/${projectId}/collections/${collectionId}/entries/${entryId}/draft`, { data })
      return response.data.data
    },
  },

  // Files endpoints
  files: {
    upload: async (projectId: string, file: File) => {
      const formData = new FormData()
      formData.append('file', file)
      
      const response = await apiClient.post<ApiResponse<{
        key: string
        filename: string
        size: number
        contentType: string
        uploadedAt: string
        uploadedBy: string
        metadata?: Record<string, string>
      }>>(`/cms/${projectId}/files/upload`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })
      return response.data.data
    },

    getFileUrl: async (projectId: string, fileKey: string) => {
      const encodedKey = encodeURIComponent(fileKey)
      const response = await apiClient.get<ApiResponse<{ url: string }>>(`/cms/${projectId}/files/${encodedKey}/url`)
      return response.data.data.url
    },

    browse: async (projectId: string, params?: { page?: number; limit?: number; search?: string }) => {
      const response = await apiClient.get<ApiResponse<{
        files: Array<{
          key: string
          filename: string
          size: number
          contentType: string
          uploadedAt: string
          uploadedBy: string
          metadata?: Record<string, string>
        }>
        total: number
        page: number
        totalPages: number
        hasNext: boolean
        hasPrev: boolean
      }>>(`/cms/${projectId}/files/browse`, { params })
      return response.data.data
    },

    delete: async (projectId: string, fileKeys: string[]) => {
      const response = await apiClient.post<ApiResponse<{ deleted: number }>>(`/cms/${projectId}/files/delete`, { fileKeys })
      return response.data.data
    },

    download: async (projectId: string, fileKey: string) => {
      const url = await cmsApi.files.getFileUrl(projectId, fileKey)
      window.open(url, '_blank')
    },

    upload: async (projectId: string, file: File) => {
      const formData = new FormData()
      formData.append('file', file)
      const response = await apiClient.post<ApiResponse<{
        key: string
        filename: string
        size: number
        contentType: string
        uploadedAt: string
        uploadedBy: string
        metadata?: Record<string, string>
      }>>(`/cms/${projectId}/files/upload`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })
      return response.data.data
    },
  },
}