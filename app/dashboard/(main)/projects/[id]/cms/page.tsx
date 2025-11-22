
"use client"

import React, { useState, useCallback } from "react"
import { useParams } from "next/navigation";
import { useRouter } from "next13-progressbar";
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import { Database, MoreHorizontal, RefreshCw, Search, AlertCircle } from "lucide-react"
import { CollectionsLoading } from "./collections-loading"
import { SectionPlaceholder } from "@/components/shared/section-placeholder"
import { UserAvatar } from "@/components/shared/user-avatar"
import { CMSBulkActions } from "@/components/shared/cms-bulk-actions"
import { CMSBreadcrumbs } from "@/components/cms/shared/CMSBreadcrumbs"
import { formatDistanceToNow } from "date-fns"
import { useCMSCollections } from "@/lib/hooks/cms"
import { useProject } from "@/lib/contexts/project-context"
import { useApp } from "@/lib/contexts/app-context"

export default function ProjectCMSPage() {
    const params = useParams()
    const router = useRouter()
    const projectId = params.id as string
    const [searchQuery, setSearchQuery] = useState("")
    const [selectedItems, setSelectedItems] = useState<string[]>([])

    const { appData } = useApp()
    const { project, isLoading: isProjectLoading, error: projectError } = useProject()
    const { data: collections, isPending: isCollectionsLoading, error: collectionsError, refetch } = useCMSCollections(projectId, {
        search: searchQuery,
    })

    const isLoading = isProjectLoading || isCollectionsLoading
    const data = collections || []

    const filteredCollections = React.useMemo(() => {
        return data || []
    }, [data])

    const handleRefresh = useCallback(() => {
        refetch()
    }, [refetch])

    const handleSelectAll = (checked: boolean) => {
        if (checked) {
            setSelectedItems(filteredCollections.map(c => c.id))
        } else {
            setSelectedItems([])
        }
    }

    const handleSelectItem = (id: string, checked: boolean) => {
        if (checked) {
            setSelectedItems(prev => [...prev, id])
        } else {
            setSelectedItems(prev => prev.filter(item => item !== id))
        }
    }

    const handleBulkDelete = () => {
        console.log("Delete items:", selectedItems)
        setSelectedItems([])
    }

    const handleBulkDuplicate = () => {
        console.log("Duplicate items:", selectedItems)
        setSelectedItems([])
    }

    if (isLoading) {
        return <CollectionsLoading />
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
        { label: "Projects", href: "/dashboard/projects" },
        { label: project.project.projectName, href: `/dashboard/projects/${projectId}` },
        { label: "CMS" },
    ]

    return (
        <div className="space-y-6">
            <CMSBreadcrumbs items={breadcrumbs} />

            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Content Management</h1>
                    <p className="text-muted-foreground mt-1">
                        Manage your project's content and entries
                    </p>
                </div>
                <Button
                    variant="outline"
                    size="sm"
                    onClick={handleRefresh}
                    className="gap-2"
                >
                    <RefreshCw className="h-4 w-4" />
                    Refresh
                </Button>
            </div>

            <Card>
                <CardHeader className="border-b">
                    <div className="flex items-center justify-between">
                        <CardTitle>Collections</CardTitle>
                        <div className="relative w-64">
                            <Search className="absolute left-2 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                            <Input
                                placeholder="Search collections..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="pl-8"
                            />
                        </div>
                    </div>
                </CardHeader>
                <CardContent className="p-0">
                    {filteredCollections.length === 0 ? (
                        <div className="py-12">
                            <SectionPlaceholder
                                variant={searchQuery ? "info" : "default"}
                                icon={Database}
                                title={searchQuery ? "No collections found" : "No collections yet"}
                                description={
                                    searchQuery
                                        ? "Try adjusting your search query"
                                        : "Create your first collection to get started with content management"
                                }
                            />
                        </div>
                    ) : (
                        <div className="rounded-md border-0">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead className="w-[50px]">
                                            <Checkbox
                                                checked={selectedItems.length === filteredCollections.length && filteredCollections.length > 0}
                                                onCheckedChange={handleSelectAll}
                                                aria-label="Select all"
                                            />
                                        </TableHead>
                                        <TableHead>Name</TableHead>
                                        <TableHead>Slug</TableHead>
                                        <TableHead>Description</TableHead>
                                        <TableHead>Created By</TableHead>
                                        <TableHead>Created</TableHead>
                                        <TableHead>Updated</TableHead>
                                        <TableHead className="w-[80px]">Actions</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {filteredCollections.map((collection) => (
                                        <TableRow
                                            key={collection.id}
                                            className="cursor-pointer"
                                            onClick={() =>
                                                router.push(
                                                    `/dashboard/projects/${projectId}/cms/collections/${collection.id}`
                                                )
                                            }
                                        >
                                            <TableCell onClick={(e) => e.stopPropagation()}>
                                                <Checkbox
                                                    checked={selectedItems.includes(collection.id)}
                                                    onCheckedChange={(checked) => 
                                                        handleSelectItem(collection.id, checked as boolean)
                                                    }
                                                    aria-label={`Select ${collection.name}`}
                                                />
                                            </TableCell>
                                            <TableCell>
                                                <div className="space-y-1">
                                                    <div className="font-medium">{collection.name}</div>
                                                    <div className="text-xs text-muted-foreground">
                                                        ID: {collection.id.slice(0, 8)}...
                                                    </div>
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <div className="font-mono text-xs bg-primary/10 text-primary px-2 py-1 rounded-md w-fit border border-primary/60">
                                                    {collection.slug}
                                                </div>
                                            </TableCell>
                                            <TableCell className="max-w-xs">
                                                <div className="truncate text-sm text-muted-foreground">
                                                    {collection.description || "No description"}
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <UserAvatar name={collection.createdBy?.name || "Unknown"} size="sm" />
                                            </TableCell>
                                            <TableCell className="text-sm text-muted-foreground">
                                                {formatDistanceToNow(new Date(collection.createdAt), { addSuffix: true })}
                                            </TableCell>
                                            <TableCell className="text-sm text-muted-foreground">
                                                {formatDistanceToNow(new Date(collection.updatedAt), { addSuffix: true })}
                                            </TableCell>
                                            <TableCell>
                                                <DropdownMenu>
                                                    <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                                                        <Button variant="ghost" size="icon" className="h-8 w-8">
                                                            <MoreHorizontal className="h-4 w-4" />
                                                            <span className="sr-only">Open menu</span>
                                                        </Button>
                                                    </DropdownMenuTrigger>
                                                    <DropdownMenuContent align="end">
                                                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                                        <DropdownMenuItem
                                                            onClick={(e) => {
                                                                e.stopPropagation()
                                                                router.push(
                                                                    `/dashboard/projects/${projectId}/cms/collections/${collection.id}`
                                                                )
                                                            }}
                                                        >
                                                            View Entries
                                                        </DropdownMenuItem>
                                                    </DropdownMenuContent>
                                                </DropdownMenu>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    )
}
