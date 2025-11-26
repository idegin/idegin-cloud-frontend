"use client"

import React, { useState, useCallback } from "react"
import { useRouter } from 'next13-progressbar'
import { useParams } from "next/navigation"
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
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import { Database, MoreHorizontal, RefreshCw, Search, AlertCircle, Plus, Loader2 } from "lucide-react"
import { CMSCollectionsLoading } from "./collections-loading"
import { SectionPlaceholder } from "@/components/shared/section-placeholder"
import { UserAvatar } from "@/components/shared/user-avatar"
import { CMSBulkActions } from "@/components/shared/cms-bulk-actions"
import { CreateCollectionDialog } from "./create-collection-dialog"
import { formatDistanceToNow } from "date-fns"
import type { CMSCollection } from "@/lib/api/cms"
import type { Project } from "@/lib/api/projects"
import { useDebouncedSearch } from "@/lib/hooks/use-debounced-search"
import { useDeleteCollection } from "@/lib/hooks/use-cms"

interface CMSCollectionsProps {
    collections: CMSCollection[]
    project: Project;
    isLoading?: boolean
    error?: Error | null
    onRefresh?: () => void
    onSearch?: (searchQuery: string) => void
    clientId: string
    projectId: string
}

export default function CMSCollections({ 
    collections, 
    project, 
    isLoading = false, 
    error = null, 
    onRefresh,
    onSearch,
    clientId,
    projectId 
}: CMSCollectionsProps) {
    const router = useRouter()
    const [selectedItems, setSelectedItems] = useState<string[]>([])
    const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
    const [showDeleteDialog, setShowDeleteDialog] = useState(false)
    const [showBulkDeleteDialog, setShowBulkDeleteDialog] = useState(false)
    const [collectionToDelete, setCollectionToDelete] = useState<CMSCollection | null>(null)
    
    const deleteCollectionMutation = useDeleteCollection(projectId)

    const { searchQuery, debouncedSearchQuery, handleSearchChange } = useDebouncedSearch(
        "",
        300,
        onSearch
    )

    const filteredCollections = React.useMemo(() => {
        if (onSearch) {
            return collections
        }

        if (!collections) return []
        if (!debouncedSearchQuery.trim()) return collections

        const query = debouncedSearchQuery.toLowerCase()
        return collections.filter(collection =>
            collection.name.toLowerCase().includes(query) ||
            collection.slug.toLowerCase().includes(query) ||
            collection.description?.toLowerCase().includes(query)
        )
    }, [collections, onSearch, debouncedSearchQuery])

    const formatDate = (date: string) => {
        return formatDistanceToNow(new Date(date), { addSuffix: true })
    }

    const handleRefresh = () => {
        if (onRefresh) {
            onRefresh()
        }
    }

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
        setShowBulkDeleteDialog(true)
    }

    const handleConfirmBulkDelete = async () => {
        try {
            await deleteCollectionMutation.mutateAsync(selectedItems)
            setSelectedItems([])
            setShowBulkDeleteDialog(false)
            if (onRefresh) onRefresh()
        } catch (error) {
            // Error is handled in the mutation
        }
    }

    const handleSingleDelete = (collection: CMSCollection) => {
        setCollectionToDelete(collection)
        setShowDeleteDialog(true)
    }

    const handleConfirmSingleDelete = async () => {
        if (!collectionToDelete) return
        try {
            await deleteCollectionMutation.mutateAsync(collectionToDelete.id)
            setShowDeleteDialog(false)
            setCollectionToDelete(null)
            if (onRefresh) onRefresh()
        } catch (error) {
            // Error is handled in the mutation
        }
    }

    const handleBulkDuplicate = () => {
        console.log("Duplicate items:", selectedItems)
        setSelectedItems([])
    }

    if (isLoading) {
        return <CMSCollectionsLoading />
    }

    if (error) {
        return (
            <div className="space-y-6">
                <div className="py-12">
                    <SectionPlaceholder
                        variant="error"
                        icon={AlertCircle}
                        title="Failed to load collections"
                        description={error.message || "An error occurred while loading the collections"}
                        action={onRefresh ? {
                            label: "Try Again",
                            onClick: onRefresh,
                            variant: "outline" as const
                        } : undefined}
                    />
                </div>
            </div>
        )
    }

    return (
        <div className="space-y-6">
            <CMSBulkActions
                selectedCount={selectedItems.length}
                onClearSelection={() => setSelectedItems([])}
                onDelete={handleBulkDelete}
                onDuplicate={handleBulkDuplicate}
            />

            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Content Management</h1>
                    <p className="text-muted-foreground mt-1">
                        Manage content for {project.projectName}
                    </p>
                </div>
                <div className="flex gap-2">
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={handleRefresh}
                        className="gap-2"
                    >
                        <RefreshCw className="h-4 w-4" />
                        Refresh
                    </Button>
                    <Button
                        size="sm"
                        onClick={() => setIsCreateDialogOpen(true)}
                        className="gap-2"
                    >
                        <Plus className="h-4 w-4" />
                        Add Collection
                    </Button>
                </div>
            </div>

            <CreateCollectionDialog
                projectId={projectId}
                open={isCreateDialogOpen}
                onOpenChange={setIsCreateDialogOpen}
            />

            <Card>
                <CardHeader className="border-b">
                    <div className="flex items-center justify-between">
                        <CardTitle>Collections</CardTitle>
                        <div className="relative w-64">
                            <Search className="absolute left-2 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                            <Input
                                placeholder="Search collections..."
                                value={searchQuery}
                                onChange={(e) => handleSearchChange(e.target.value)}
                                className="pl-8"
                            />
                        </div>
                    </div>
                </CardHeader>
                <CardContent className="p-0">
                    {filteredCollections.length === 0 ? (
                        <div className="py-12">
                            <SectionPlaceholder
                                variant={debouncedSearchQuery ? "info" : "default"}
                                icon={Database}
                                title={debouncedSearchQuery ? "No collections found" : "No collections yet"}
                                description={
                                    debouncedSearchQuery
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
                                                    `/admin/clients/${clientId}/projects/${projectId}/cms/collections/${collection.id}`
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
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <Badge variant="outline" className="font-mono text-xs">
                                                    {collection.slug}
                                                </Badge>
                                            </TableCell>
                                            <TableCell className="max-w-xs">
                                                <div className="truncate text-sm text-muted-foreground">
                                                    {collection.description || "No description"}
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <UserAvatar 
                                                    name={collection.createdBy?.name || "Unknown"} 
                                                    size="sm" 
                                                />
                                            </TableCell>
                                            <TableCell className="text-sm text-muted-foreground">
                                                {formatDate(collection.createdAt)}
                                            </TableCell>
                                            <TableCell className="text-sm text-muted-foreground">
                                                {formatDate(collection.updatedAt)}
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
                                                                    `/admin/clients/${clientId}/projects/${projectId}/cms/collections/${collection.id}`
                                                                )
                                                            }}
                                                        >
                                                            View Entries
                                                        </DropdownMenuItem>
                                                        <DropdownMenuItem
                                                            onClick={(e) => {
                                                                e.stopPropagation()
                                                                router.push(
                                                                    `/admin/clients/${clientId}/projects/${projectId}/cms/collections/${collection.id}/schema`
                                                                )
                                                            }}
                                                        >
                                                            Manage Schema
                                                        </DropdownMenuItem>
                                                        <DropdownMenuSeparator />
                                                        <DropdownMenuItem
                                                            onClick={(e) => {
                                                                e.stopPropagation()
                                                                handleSingleDelete(collection)
                                                            }}
                                                            className="text-destructive"
                                                        >
                                                            Delete Collection
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

            {/* Single Delete Confirmation Dialog */}
            <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                        <AlertDialogDescription>
                            This action cannot be undone. This will permanently delete the collection
                            <span className="font-semibold"> "{collectionToDelete?.name}" </span>
                            and remove all associated entries, fields, and data from the database.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel disabled={deleteCollectionMutation.isPending}>
                            Cancel
                        </AlertDialogCancel>
                        <AlertDialogAction
                            onClick={handleConfirmSingleDelete}
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

            {/* Bulk Delete Confirmation Dialog */}
            <AlertDialog open={showBulkDeleteDialog} onOpenChange={setShowBulkDeleteDialog}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Delete {selectedItems.length} collection{selectedItems.length > 1 ? 's' : ''}?</AlertDialogTitle>
                        <AlertDialogDescription>
                            This action cannot be undone. This will permanently delete 
                            <span className="font-semibold"> {selectedItems.length} collection{selectedItems.length > 1 ? 's' : ''} </span>
                            and remove all associated entries, fields, and data from the database.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel disabled={deleteCollectionMutation.isPending}>
                            Cancel
                        </AlertDialogCancel>
                        <AlertDialogAction
                            onClick={handleConfirmBulkDelete}
                            disabled={deleteCollectionMutation.isPending}
                            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                        >
                            {deleteCollectionMutation.isPending ? (
                                <>
                                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                    Deleting...
                                </>
                            ) : (
                                `Delete ${selectedItems.length} Collection${selectedItems.length > 1 ? 's' : ''}`
                            )}
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    )
}