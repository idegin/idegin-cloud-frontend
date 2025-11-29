"use client"

import React, { createContext, useContext, ReactNode } from "react"
import { useQuery } from "@tanstack/react-query"
import { projectsApi, type ProjectFullDetails } from "@/lib/api/projects"

interface ProjectContextValue {
  project: ProjectFullDetails | null
  isLoading: boolean
  error: Error | null
  refetch: () => void
}

const ProjectContext = createContext<ProjectContextValue | undefined>(undefined)

interface ProjectProviderProps {
  children: ReactNode
  clientId: string
  projectId: string
}

export function ProjectProvider({ children, clientId, projectId }: ProjectProviderProps) {
  const { data, isLoading, error, refetch } = useQuery<ProjectFullDetails>({
    queryKey: ["project", projectId, clientId],
    queryFn: () => projectsApi.getFullDetails(projectId),
    enabled: !!projectId && !!clientId,
    staleTime: 1000 * 60 * 5,
    refetchOnWindowFocus: false,
  })

  const value: ProjectContextValue = {
    project: data || null,
    isLoading,
    error: error as Error | null,
    refetch: () => {
      refetch()
    },
  }

  return (
    <ProjectContext.Provider value={value}>
      {children}
    </ProjectContext.Provider>
  )
}

export function useProject() {
  const context = useContext(ProjectContext)
  if (context === undefined) {
    throw new Error("useProject must be used within a ProjectProvider")
  }
  return context
}

