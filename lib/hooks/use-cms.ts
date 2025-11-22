"use client"

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { cmsApi, type CMSCollection, type CreateCollectionData, type UpdateCollectionData, type CollectionFilters } from "@/lib/api/cms"
import { toast } from "@/hooks/use-toast"

export function useCMSCollections(projectId: string, filters?: CollectionFilters) {
  return useQuery({
    queryKey: ["cms-collections", projectId, filters],
    queryFn: () => cmsApi.collections.getByProject(projectId, filters),
    enabled: !!projectId,
  })
}

export function useCMSCollection(projectId: string, collectionId: string) {
  return useQuery({
    queryKey: ["cms-collection", projectId, collectionId],
    queryFn: () => cmsApi.collections.getById(projectId, collectionId),
    enabled: !!projectId && !!collectionId,
  })
}

export function useCreateCollection(projectId: string) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: CreateCollectionData) => cmsApi.collections.create(projectId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cms-collections", projectId] })
      toast({
        title: "Success",
        description: "Collection created successfully",
      })
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.response?.data?.message || "Failed to create collection",
        variant: "destructive",
      })
    },
  })
}

export function useUpdateCollection(projectId: string, collectionId: string) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: UpdateCollectionData) => cmsApi.collections.update(projectId, collectionId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cms-collections", projectId] })
      queryClient.invalidateQueries({ queryKey: ["cms-collection", projectId, collectionId] })
      toast({
        title: "Success",
        description: "Collection updated successfully",
      })
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.response?.data?.message || "Failed to update collection",
        variant: "destructive",
      })
    },
  })
}

export function useDeleteCollection(projectId: string) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (collectionId: string) => cmsApi.collections.delete(projectId, collectionId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cms-collections", projectId] })
      toast({
        title: "Success",
        description: "Collection deleted successfully",
      })
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.response?.data?.message || "Failed to delete collection",
        variant: "destructive",
      })
    },
  })
}