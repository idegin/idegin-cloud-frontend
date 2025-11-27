"use client"

import React, { useState, useCallback } from "react"
import { useParams, useRouter } from "next/navigation"
import CMSCollectionEntires, { CMSCollectionEntriesLoading } from "@/components/cms/CMSCollectionEntires"
import { useCMSCollection as useCMSCollectionContext } from "@/lib/contexts/cms-collection-context"
import { useCMSEntries } from "@/lib/hooks/cms"
import { useProject } from "@/lib/contexts/project-context"
import { SectionPlaceholder } from "@/components/shared/section-placeholder"
import { CMSBreadcrumbs } from "@/components/cms/shared/CMSBreadcrumbs"
import { Database } from "lucide-react"

export default function CollectionEntriesPage() {
    const params = useParams()
    const router = useRouter()
    const projectId = params.id as string
    const collectionId = params.collectionId as string
    
    const [searchQuery, setSearchQuery] = useState("")
    const [currentPage, setCurrentPage] = useState(1)
    const limit = 10

    const { project, isLoading: isProjectLoading } = useProject()
    
    const { cmsCollectionData, isLoading: isCollectionLoading, error: collectionError } = useCMSCollectionContext()
    
    const { data: entries, isPending: isEntriesLoading, error: entriesError, refetch } = useCMSEntries(
        projectId, 
        collectionId, 
        { 
            search: searchQuery || undefined,
            page: currentPage,
            limit
        }
    )

    const handleSearch = useCallback((query: string) => {
        setSearchQuery(query)
        setCurrentPage(1)
    }, [])

    const handleRefresh = useCallback(() => {
        refetch()
    }, [refetch])

    const handleBack = useCallback(() => {
        router.push(`/dashboard/projects/${projectId}/cms`)
    }, [router, projectId])

    if (isCollectionLoading || isProjectLoading) {
        return (
            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <div className="space-y-2">
                        <div className="h-8 w-48 bg-muted animate-pulse rounded" />
                        <div className="h-4 w-64 bg-muted animate-pulse rounded" />
                    </div>
                    <div className="h-9 w-20 bg-muted animate-pulse rounded" />
                </div>
                <div className="rounded-md border">
                    <CMSCollectionEntriesLoading />
                </div>
            </div>
        )
    }

    if (collectionError || !cmsCollectionData.collection) {
        return (
            <div className="space-y-6">
                {project && (
                    <CMSBreadcrumbs items={[
                        { label: "Projects", href: "/dashboard/projects" },
                        { label: project.project.projectName, href: `/dashboard/projects/${projectId}` },
                        { label: "CMS", href: `/dashboard/projects/${projectId}/cms` },
                        { label: "Collection" },
                    ]} />
                )}
                <div className="py-12">
                    <SectionPlaceholder
                        variant="error"
                        icon={Database}
                        title="Failed to load collection"
                        description="There was an error loading the collection. Please try again."
                    />
                </div>
            </div>
        )
    }

    const breadcrumbs = project ? [
        { label: "Projects", href: "/dashboard/projects" },
        { label: project.project.projectName, href: `/dashboard/projects/${projectId}` },
        { label: "CMS", href: `/dashboard/projects/${projectId}/cms` },
        { label: cmsCollectionData.collection.name },
    ] : []

    return (
        <div className="space-y-6">
            <CMSCollectionEntires
                collection={cmsCollectionData.collection}
                entries={entries || null}
                isLoading={isEntriesLoading}
                error={entriesError}
                onRefresh={handleRefresh}
                onSearch={handleSearch}
                onBack={handleBack}
                projectId={projectId}
                collectionId={collectionId}
                baseUrl={`/dashboard/projects/${projectId}`}
                breadcrumbs={breadcrumbs}
            />
        </div>
    )
}
