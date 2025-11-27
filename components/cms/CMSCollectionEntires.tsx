"use client"

import React, { useState, useMemo, useCallback } from "react"
import { useRouter } from "next13-progressbar"
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
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"
import { FileText, MoreHorizontal, RefreshCw, Search, AlertCircle, Plus, Edit, Trash2, Settings, ArrowLeft, BookOpen, Loader2 } from "lucide-react"
import { SectionPlaceholder } from "@/components/shared/section-placeholder"
import { CMSBulkActions } from "@/components/shared/cms-bulk-actions"
import { CMSBreadcrumbs, type CMSBreadcrumbItemType } from "./shared/CMSBreadcrumbs"
import { formatDistanceToNow } from "date-fns"
import { useDebounce } from "@/lib/hooks/use-debounce"
import { useApp } from "@/lib/contexts/app-context"
import { useDeleteCollection } from "@/lib/hooks/use-cms"
import type { CMSCollection, CMSEntry, EntriesResponse } from "@/lib/api/cms"

interface CMSCollectionEntriesProps {
    collection: CMSCollection
    entries: EntriesResponse | null
    isLoading?: boolean
    error?: Error | null
    onRefresh?: () => void
    onSearch?: (query: string) => void
    onBack?: () => void
    projectId: string
    collectionId: string
    baseUrl?: string
    breadcrumbs?: CMSBreadcrumbItemType[]
}

export function CMSCollectionEntriesLoading() {
    return (
        <div className="rounded-md border">
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead className="w-[50px]">
                            <div className="h-4 w-4 bg-muted animate-pulse rounded" />
                        </TableHead>
                        <TableHead className="min-w-[200px]">
                            <div className="h-4 w-20 bg-muted animate-pulse rounded" />
                        </TableHead>
                        <TableHead className="min-w-[150px]">
                            <div className="h-4 w-16 bg-muted animate-pulse rounded" />
                        </TableHead>
                        <TableHead className="min-w-[100px]">
                            <div className="h-4 w-16 bg-muted animate-pulse rounded" />
                        </TableHead>
                        <TableHead className="min-w-[120px]">
                            <div className="h-4 w-16 bg-muted animate-pulse rounded" />
                        </TableHead>
                        <TableHead className="min-w-[120px]">
                            <div className="h-4 w-16 bg-muted animate-pulse rounded" />
                        </TableHead>
                        <TableHead className="w-[80px]">
                            <div className="h-4 w-12 bg-muted animate-pulse rounded" />
                        </TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {[...Array(5)].map((_, i) => (
                        <TableRow key={i}>
                            <TableCell>
                                <div className="h-4 w-4 bg-muted animate-pulse rounded" />
                            </TableCell>
                            <TableCell>
                                <div className="h-4 w-32 bg-muted animate-pulse rounded" />
                            </TableCell>
                            <TableCell>
                                <div className="h-4 w-24 bg-muted animate-pulse rounded" />
                            </TableCell>
                            <TableCell>
                                <div className="h-4 w-16 bg-muted animate-pulse rounded" />
                            </TableCell>
                            <TableCell>
                                <div className="h-4 w-20 bg-muted animate-pulse rounded" />
                            </TableCell>
                            <TableCell>
                                <div className="h-4 w-20 bg-muted animate-pulse rounded" />
                            </TableCell>
                            <TableCell>
                                <div className="h-8 w-8 bg-muted animate-pulse rounded" />
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    )
}

export default function CMSCollectionEntires({
    collection,
    entries,
    isLoading = false,
    error = null,
    onRefresh,
    onSearch,
    onBack,
    projectId,
    collectionId,
    baseUrl,
    breadcrumbs,
}: CMSCollectionEntriesProps) {
    const router = useRouter()
    const [searchQuery, setSearchQuery] = useState("")
    const [selectedItems, setSelectedItems] = useState<string[]>([])
    const [showDeleteDialog, setShowDeleteDialog] = useState(false)
    const { appData } = useApp()
    
    const debouncedSearch = useDebounce(searchQuery, 500)
    const deleteCollectionMutation = useDeleteCollection(projectId)

    const entriesUrl = baseUrl || `/dashboard/projects/${projectId}`
    const userRole = appData?.user?.role || "client"

    React.useEffect(() => {
        if (onSearch) {
            onSearch(debouncedSearch)
        }
    }, [debouncedSearch, onSearch])

    const entriesData = entries?.data || []

    const formatDate = (date: string) => {
        return formatDistanceToNow(new Date(date), { addSuffix: true })
    }

    const handleRefresh = useCallback(() => {
        if (onRefresh) {
            onRefresh()
        }
    }, [onRefresh])

    const handleSelectAll = useCallback((checked: boolean) => {
        if (checked) {
            setSelectedItems(entriesData.map((e: CMSEntry) => e.id))
        } else {
            setSelectedItems([])
        }
    }, [entriesData])

    const handleSelectItem = useCallback((id: string, checked: boolean) => {
        if (checked) {
            setSelectedItems(prev => [...prev, id])
        } else {
            setSelectedItems(prev => prev.filter(item => item !== id))
        }
    }, [])

    const handleBulkDelete = useCallback(() => {
        console.log("Delete items:", selectedItems)
        setSelectedItems([])
    }, [selectedItems])

    const handleBulkDuplicate = useCallback(() => {
        console.log("Duplicate items:", selectedItems)
        setSelectedItems([])
    }, [selectedItems])

    const handleDeleteCollection = useCallback(async () => {
        try {
            await deleteCollectionMutation.mutateAsync(collectionId)
            setShowDeleteDialog(false)
            if (onBack) onBack()
        } catch (error) {
            // Error is handled in the mutation
        }
    }, [collectionId, deleteCollectionMutation, onBack])

    return (
        <div className="space-y-6">
            <CMSBreadcrumbs items={breadcrumbs} />

            <CMSBulkActions
                selectedCount={selectedItems.length}
                onClearSelection={() => setSelectedItems([])}
                onDelete={handleBulkDelete}
                onDuplicate={handleBulkDuplicate}
            />

            <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                    {onBack && (
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={onBack}
                            className="h-9 w-9"
                        >
                            <ArrowLeft className="h-4 w-4" />
                        </Button>
                    )}
                    <div className="space-y-1">
                        <h1 className="text-3xl font-bold tracking-tight">{collection.name}</h1>
                        <p className="text-muted-foreground">
                            {collection.description || "Manage collection entries"}
                        </p>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="outline" size="sm">
                                <Settings className="h-4 w-4 mr-2" />
                                Actions
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Collection Actions</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem onClick={handleRefresh}>
                                <RefreshCw className="h-4 w-4 mr-2" />
                                Refresh
                            </DropdownMenuItem>
                            {userRole === "super_admin" && (
                                <>
                                    <DropdownMenuItem 
                                        onClick={() => router.push(`${entriesUrl}/cms/collections/${collectionId}/fields`)}
                                    >
                                        <Settings className="h-4 w-4 mr-2" />
                                        Edit Fields
                                    </DropdownMenuItem>
                                    <DropdownMenuItem 
                                        onClick={() => router.push(`${entriesUrl}/cms/collections/${collectionId}/docs`)}
                                    >
                                        <BookOpen className="h-4 w-4 mr-2" />
                                        API Documentation
                                    </DropdownMenuItem>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem 
                                        className="text-destructive"
                                        onClick={() => setShowDeleteDialog(true)}
                                    >
                                        <Trash2 className="h-4 w-4 mr-2" />
                                        Delete Collection
                                    </DropdownMenuItem>
                                </>
                            )}
                        </DropdownMenuContent>
                    </DropdownMenu>
                    <Button
                        onClick={() => router.push(`${entriesUrl}/cms/collections/${collectionId}/create`)}
                        className="gap-2"
                        size='sm'
                    >
                        <Plus className="h-4 w-4" />
                        Add Entry
                    </Button>
                </div>
            </div>

            <Card>
                <CardHeader className="border-b">
                    <div className="flex items-center justify-between">
                        <CardTitle>Entries</CardTitle>
                        <div className="relative w-64">
                            <Search className="absolute left-2 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                            <Input
                                placeholder="Search entries..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="pl-8"
                            />
                        </div>
                    </div>
                </CardHeader>
                <CardContent className="p-0">
                    {isLoading ? (
                        <CMSCollectionEntriesLoading />
                    ) : entriesData.length === 0 ? (
                        <div className="py-12">
                            <SectionPlaceholder
                                variant={searchQuery ? "info" : "default"}
                                icon={FileText}
                                title={searchQuery ? "No entries found" : "No entries yet"}
                                description={
                                    searchQuery
                                        ? "Try adjusting your search query"
                                        : "Create your first entry to get started"
                                }
                            />
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead className="w-[50px]">
                                            <Checkbox
                                                checked={selectedItems.length === entriesData.length && entriesData.length > 0}
                                                onCheckedChange={handleSelectAll}
                                                aria-label="Select all"
                                            />
                                        </TableHead>
                                        <TableHead className="w-[250px]">Name</TableHead>
                                        <TableHead className="w-[180px]">Slug</TableHead>
                                        <TableHead className="w-[100px]">Status</TableHead>
                                        <TableHead className="min-w-[120px]">Created</TableHead>
                                        <TableHead className="min-w-[120px]">Updated</TableHead>
                                        <TableHead className="w-[80px]">Actions</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {entriesData.map((entry: CMSEntry) => (
                                        <TableRow
                                            key={entry.id}
                                            className="cursor-pointer"
                                            onClick={() =>
                                                router.push(
                                                    `${entriesUrl}/cms/collections/${collectionId}/entries/${entry.id}`
                                                )
                                            }
                                        >
                                            <TableCell onClick={(e) => e.stopPropagation()}>
                                                <Checkbox
                                                    checked={selectedItems.includes(entry.id)}
                                                    onCheckedChange={(checked) =>
                                                        handleSelectItem(entry.id, checked as boolean)
                                                    }
                                                    aria-label={`Select ${entry.data.name || entry.data.title || 'entry'}`}
                                                />
                                            </TableCell>
                                            <TableCell className="max-w-[250px]">
                                                <div className="truncate font-medium">
                                                    {entry.data.name || entry.data.title || "Untitled"}
                                                </div>
                                            </TableCell>
                                            <TableCell className="max-w-[180px]">
                                                <div className="truncate text-muted-foreground">
                                                    {entry.data.slug || "no-slug"}
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <Badge variant={entry.published ? "default" : "secondary"}>
                                                    {entry.published ? "Published" : "Draft"}
                                                </Badge>
                                            </TableCell>
                                            <TableCell className="text-sm text-muted-foreground">
                                                {formatDate(entry.createdAt)}
                                            </TableCell>
                                            <TableCell className="text-sm text-muted-foreground">
                                                {formatDate(entry.updatedAt)}
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
                                                                    `${entriesUrl}/cms/collections/${collectionId}/entries/${entry.id}`
                                                                )
                                                            }}
                                                        >
                                                            Edit Entry
                                                        </DropdownMenuItem>
                                                        
                                                        <DropdownMenuSeparator />
                                                        <DropdownMenuItem
                                                            onClick={(e) => {
                                                                e.stopPropagation()
                                                            }}
                                                            className="text-destructive"
                                                        >
                                                            Delete Entry
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

            <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                        <AlertDialogDescription>
                            This action cannot be undone. This will permanently delete the collection
                            <span className="font-semibold"> "{collection.name}" </span>
                            and remove all associated entries and data from the database.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel disabled={deleteCollectionMutation.isPending}>
                            Cancel
                        </AlertDialogCancel>
                        <AlertDialogAction
                            onClick={handleDeleteCollection}
                            disabled={deleteCollectionMutation.isPending}
                            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                        >
                            {deleteCollectionMutation.isPending ? (
                                <>
                                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                    Deleting...
                                </>
                            ) : (
                                "Delete Collection"
                            )}
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    )
}