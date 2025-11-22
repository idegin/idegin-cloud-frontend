"use client"

import { ProjectProvider } from "@/lib/contexts/project-context"
import { useParams } from "next/navigation"

export default function ProjectLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const params = useParams()
  const clientId = params.id as string
  const projectId = params.projectId as string

  return (
    <ProjectProvider clientId={clientId} projectId={projectId}>
      {children}
    </ProjectProvider>
  )
}

