"use client"

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { collectionsApi } from "@/lib/api/collections"
import { toast } from "@/hooks/use-toast"

export function useCollections(projectId: string) {
  return useQuery({
    queryKey: ["collections", projectId],
    queryFn: () => collectionsApi.getByProject(projectId),
    enabled: !!projectId,
  })
}

export function useCollection(projectId: string, collectionId: string) {
  return useQuery({
    queryKey: ["collection", projectId, collectionId],
    queryFn: () => collectionsApi.getById(projectId, collectionId),
    enabled: !!projectId && !!collectionId,
  })
}

export function useCreateCollection(projectId: string) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: { name: string; description?: string }) =>
      collectionsApi.create(projectId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["collections", projectId] })
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
    mutationFn: (data: { name?: string; description?: string }) =>
      collectionsApi.update(projectId, collectionId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["collections", projectId] })
      queryClient.invalidateQueries({ queryKey: ["collection", projectId, collectionId] })
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
    mutationFn: (collectionId: string) =>
      collectionsApi.delete(projectId, collectionId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["collections", projectId] })
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
