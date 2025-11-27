"use client"

import { useParams } from "next/navigation"
import { useState, useCallback } from "react"
import CMSCollections from "@/components/cms/CMSCollections"
import { CMSCollectionsLoading } from "@/components/cms/collections-loading"
import { useCMSCollections } from "@/lib/hooks/use-cms"
import { useProject } from "@/lib/contexts/project-context"
import { SectionPlaceholder } from "@/components/shared/section-placeholder"
import { AlertCircle } from "lucide-react"

export default function Page() {
    const params = useParams()
    const clientId = params.id as string
    const projectId = params.projectId as string
    
    const [searchQuery, setSearchQuery] = useState("")
    
    const { project, isLoading: isProjectLoading, error: projectError } = useProject()
    const { data: collections, isLoading: isCollectionsLoading, error: collectionsError, refetch } = useCMSCollections(projectId, {
        search: searchQuery,
    })

    const handleSearch = useCallback((query: string) => {
        setSearchQuery(query)
    }, [])

    if (isProjectLoading || isCollectionsLoading) {
        return <CMSCollectionsLoading />
    }

    if (projectError || !project) {
        return (
            <div className="py-12">
                <SectionPlaceholder
                    variant="error"
                    icon={AlertCircle}
                    title="Failed to load project"
                    description={projectError?.message || "Unable to load project details. Please try again."}
                />
            </div>
        )
    }

    const breadcrumbs = [
        { label: "Clients", href: "/admin/clients" },
        { label: project.organization.organizationName, href: `/admin/clients/${clientId}` },
        { label: project.project.projectName, href: `/admin/clients/${clientId}/projects/${projectId}` },
        { label: "CMS" },
    ]

    return (
        <CMSCollections
            collections={collections || []}
            project={project.project}
            isLoading={isCollectionsLoading}
            error={collectionsError}
            onRefresh={() => refetch()}
            onSearch={handleSearch}
            clientId={clientId}
            projectId={projectId}
            breadcrumbs={breadcrumbs}
        />
    )
}
