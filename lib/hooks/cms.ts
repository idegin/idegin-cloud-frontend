import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { cmsApi, type CollectionFilters, type EntryFilters } from "@/lib/api/cms"

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

export function useCMSEntries(projectId: string, collectionId: string, filters?: EntryFilters) {
  return useQuery({
    queryKey: ["cms-entries", projectId, collectionId, filters],
    queryFn: () => cmsApi.entries.getByCollection(projectId, collectionId, filters),
    enabled: !!projectId && !!collectionId,
  })
}

export function useCMSEntry(projectId: string, collectionId: string, entryId: string) {
  return useQuery({
    queryKey: ["cms-entry", projectId, collectionId, entryId],
    queryFn: () => cmsApi.entries.getById(projectId, collectionId, entryId),
    enabled: !!projectId && !!collectionId && !!entryId,
  })
}

export function useUpdateSchema(projectId: string, collectionId: string) {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: (data: {
      toCreate?: any[]
      toUpdate?: any[]
      toDelete?: any[]
    }) => cmsApi.schema.update(projectId, collectionId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cms-collection", projectId, collectionId] })
      queryClient.invalidateQueries({ queryKey: ["cms-schema", projectId, collectionId] })
    },
  })
}