"use client"

import { useSession } from "next-auth/react"
import { useQuery } from "@tanstack/react-query"
import { projectsApi } from "@/lib/api/projects"
import { hostingPlansApi } from "@/lib/api/hosting-plans"
import { invoicesApi } from "@/lib/api/invoices"

export function useClientProjects() {
  const { data: session } = useSession()
  const clientId = session?.user?.id

  return useQuery({
    queryKey: ["client-projects", clientId],
    queryFn: () => projectsApi.getAll({ clientId, limit: 50 }),
    enabled: !!clientId,
  })
}

export function useClientHostingPlans() {
  const { data: session } = useSession()
  const clientId = session?.user?.id

  return useQuery({
    queryKey: ["client-hosting", clientId],
    queryFn: () => hostingPlansApi.getAll({ clientId, limit: 50 }),
    enabled: !!clientId,
  })
}

export function useClientInvoices() {
  const { data: session } = useSession()
  const clientId = session?.user?.id

  return useQuery({
    queryKey: ["client-invoices", clientId],
    queryFn: () => invoicesApi.getAll({ clientId, limit: 50 }),
    enabled: !!clientId,
  })
}
