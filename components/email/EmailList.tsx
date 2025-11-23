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
import {
    Mail,
    MoreHorizontal,
    RefreshCw,
    Search,
    Plus,
    Edit,
    Trash2,
    Eye,
    Send,
    ArrowLeft,
    Megaphone,
} from "lucide-react"
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip"
import { SectionPlaceholder } from "@/components/shared/section-placeholder"
import { CMSBulkActions } from "@/components/shared/cms-bulk-actions"
import { formatDistanceToNow } from "date-fns"
import { useDebounce } from "@/lib/hooks/use-debounce"

export interface MailingListItem {
    id: string
    name: string
    email: string
    active: boolean
    label: string
    createdAt: string
}

interface EmailListProps {
    mailingList: MailingListItem[]
    isLoading?: boolean
    error?: Error | null
    onRefresh?: () => void
    onSearch?: (query: string) => void
    onBack?: () => void
    projectId: string
    baseUrl?: string
}

const labelColors: Record<string, string> = {
    Newsletter: "bg-blue-500/10 text-blue-700 dark:text-blue-400 border-blue-500/20",
    Updates: "bg-green-500/10 text-green-700 dark:text-green-400 border-green-500/20",
    Promotions: "bg-purple-500/10 text-purple-700 dark:text-purple-400 border-purple-500/20",
    Marketing: "bg-orange-500/10 text-orange-700 dark:text-orange-400 border-orange-500/20",
    General: "bg-gray-500/10 text-gray-700 dark:text-gray-400 border-gray-500/20",
}

const mockMailingList: MailingListItem[] = [
    {
        id: "1",
        name: "John Doe",
        email: "john.doe@example.com",
        active: true,
        label: "Newsletter",
        createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
    },
    {
        id: "2",
        name: "Jane Smith",
        email: "jane.smith@example.com",
        active: true,
        label: "Updates",
        createdAt: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString(),
    },
    {
        id: "3",
        name: "Bob Johnson",
        email: "bob.johnson@example.com",
        active: false,
        label: "Newsletter",
        createdAt: new Date(Date.now() - 21 * 24 * 60 * 60 * 1000).toISOString(),
    },
    {
        id: "4",
        name: "Alice Williams",
        email: "alice.williams@example.com",
        active: true,
        label: "Promotions",
        createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
    },
    {
        id: "5",
        name: "Charlie Brown",
        email: "charlie.brown@example.com",
        active: true,
        label: "Updates",
        createdAt: new Date(Date.now() - 45 * 24 * 60 * 60 * 1000).toISOString(),
    },
]

export default function EmailList({
    mailingList = mockMailingList,
    isLoading = false,
    error = null,
    onRefresh,
    onSearch,
    onBack,
    projectId,
    baseUrl,
}: EmailListProps) {
    const router = useRouter()
    const [searchQuery, setSearchQuery] = useState("")
    const [selectedItems, setSelectedItems] = useState<string[]>([])
    const [showDeleteDialog, setShowDeleteDialog] = useState(false)
    const [itemToDelete, setItemToDelete] = useState<string | null>(null)

    const debouncedSearch = useDebounce(searchQuery, 500)

    const emailUrl = baseUrl || `/dashboard/projects/${projectId}`

    React.useEffect(() => {
        if (onSearch) {
            onSearch(debouncedSearch)
        }
    }, [debouncedSearch, onSearch])

    const filteredList = useMemo(() => {
        if (!debouncedSearch) return mailingList

        return mailingList.filter(
            (item) =>
                item.name.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
                item.email.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
                item.label.toLowerCase().includes(debouncedSearch.toLowerCase())
        )
    }, [mailingList, debouncedSearch])

    const formatDate = (date: string) => {
        return formatDistanceToNow(new Date(date), { addSuffix: true })
    }

    const handleRefresh = useCallback(() => {
        if (onRefresh) {
            onRefresh()
        }
    }, [onRefresh])

    const handleSelectAll = useCallback(
        (checked: boolean) => {
            if (checked) {
                setSelectedItems(filteredList.map((item) => item.id))
            } else {
                setSelectedItems([])
            }
        },
        [filteredList]
    )

    const handleSelectItem = useCallback((id: string, checked: boolean) => {
        if (checked) {
            setSelectedItems((prev) => [...prev, id])
        } else {
            setSelectedItems((prev) => prev.filter((item) => item !== id))
        }
    }, [])

    const handleBulkDelete = useCallback(() => {
        console.log("Delete items:", selectedItems)
        setSelectedItems([])
    }, [selectedItems])

    const handleBulkSendEmail = useCallback(() => {
        console.log("Send email to items:", selectedItems)
        setSelectedItems([])
    }, [selectedItems])

    const handleView = useCallback(
        (id: string) => {
            console.log("View item:", id)
        },
        []
    )

    const handleEdit = useCallback(
        (id: string) => {
            console.log("Edit item:", id)
        },
        []
    )

    const handleSendEmail = useCallback(
        (id: string) => {
            console.log("Send email to:", id)
        },
        []
    )

    const handleDelete = useCallback((id: string) => {
        setItemToDelete(id)
        setShowDeleteDialog(true)
    }, [])

    const confirmDelete = useCallback(() => {
        if (itemToDelete) {
            console.log("Delete item:", itemToDelete)
            setItemToDelete(null)
        }
        setShowDeleteDialog(false)
    }, [itemToDelete])

    if (isLoading) {
        return <EmailListLoading />
    }

    if (error) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <SectionPlaceholder
                    variant="error"
                    title="Failed to load mailing list"
                    description="We encountered an error while fetching the mailing list. Please try again."
                    action={{
                        label: "Retry",
                        onClick: handleRefresh,
                        variant: "default",
                    }}
                />
            </div>
        )
    }

    return (
        <div className="space-y-6">
            <CMSBulkActions
                selectedCount={selectedItems.length}
                onClearSelection={() => setSelectedItems([])}
                onDelete={handleBulkDelete}
                actions={[
                    {
                        label: "Send Email",
                        onClick: handleBulkSendEmail,
                        icon: Send,
                    },
                ]}
            />

            <div className="flex items-center justify-between">
                <div className="space-y-1">
                    {onBack && (
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={onBack}
                            className="-ml-2 mb-2"
                        >
                            <ArrowLeft className="h-4 w-4 mr-2" />
                            Back
                        </Button>
                    )}
                    <h1 className="text-3xl font-bold tracking-tight">Mailing List</h1>
                    <p className="text-muted-foreground mt-1">
                        Manage your email subscribers and send newsletters
                    </p>
                </div>
                <div className="flex items-center gap-2">
                    <TooltipProvider>
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <Button variant="outline" size="icon" onClick={handleRefresh}>
                                    <RefreshCw className="h-4 w-4" />
                                    <span className="sr-only">Refresh</span>
                                </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                                <p>Refresh list</p>
                            </TooltipContent>
                        </Tooltip>
                    </TooltipProvider>
                    <Button variant="outline" size="sm" className="gap-2">
                        <Megaphone className="h-4 w-4" />
                        Manage Campaigns
                    </Button>
                    <Button size="sm" className="gap-2">
                        <Plus className="h-4 w-4" />
                        Add Subscriber
                    </Button>
                </div>
            </div>

            <Card>
                <CardHeader className="border-b">
                    <div className="flex items-center justify-between">
                        <CardTitle>Subscribers</CardTitle>
                        <div className="relative w-64">
                            <Search className="absolute left-2 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                            <Input
                                placeholder="Search subscribers..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="pl-8"
                            />
                        </div>
                    </div>
                </CardHeader>
                <CardContent className="p-0">
                    {filteredList.length === 0 ? (
                        <div className="py-12">
                            <SectionPlaceholder
                                variant={searchQuery ? "info" : "default"}
                                icon={Mail}
                                title={searchQuery ? "No subscribers found" : "No subscribers yet"}
                                description={
                                    searchQuery
                                        ? "Try adjusting your search query"
                                        : "Add your first subscriber to get started"
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
                                                checked={
                                                    selectedItems.length === filteredList.length &&
                                                    filteredList.length > 0
                                                }
                                                onCheckedChange={handleSelectAll}
                                                aria-label="Select all"
                                            />
                                        </TableHead>
                                        <TableHead className="min-w-[200px]">Name</TableHead>
                                        <TableHead className="min-w-[250px]">Email</TableHead>
                                        <TableHead className="w-[100px]">Status</TableHead>
                                        <TableHead className="w-[150px]">Label</TableHead>
                                        <TableHead className="min-w-[150px]">Date Created</TableHead>
                                        <TableHead className="w-[80px]">Actions</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {filteredList.map((item) => (
                                        <TableRow key={item.id}>
                                            <TableCell onClick={(e) => e.stopPropagation()}>
                                                <Checkbox
                                                    checked={selectedItems.includes(item.id)}
                                                    onCheckedChange={(checked) =>
                                                        handleSelectItem(item.id, checked as boolean)
                                                    }
                                                    aria-label={`Select ${item.name}`}
                                                />
                                            </TableCell>
                                            <TableCell className="font-medium">{item.name}</TableCell>
                                            <TableCell className="text-muted-foreground">
                                                {item.email}
                                            </TableCell>
                                            <TableCell>
                                                <Badge 
                                                    className={item.active 
                                                        ? "bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-500/20 hover:bg-emerald-500/20" 
                                                        : "bg-red-500/10 text-red-700 dark:text-red-400 border-red-500/20 hover:bg-red-500/20"
                                                    }
                                                    variant="outline"
                                                >
                                                    {item.active ? "Active" : "Inactive"}
                                                </Badge>
                                            </TableCell>
                                            <TableCell>
                                                <Badge 
                                                    variant="outline"
                                                    className={labelColors[item.label] || labelColors.General}
                                                >
                                                    {item.label}
                                                </Badge>
                                            </TableCell>
                                            <TableCell className="text-sm text-muted-foreground">
                                                {formatDate(item.createdAt)}
                                            </TableCell>
                                            <TableCell>
                                                <DropdownMenu>
                                                    <DropdownMenuTrigger asChild>
                                                        <Button
                                                            variant="ghost"
                                                            size="icon"
                                                            className="h-8 w-8"
                                                        >
                                                            <MoreHorizontal className="h-4 w-4" />
                                                            <span className="sr-only">Open menu</span>
                                                        </Button>
                                                    </DropdownMenuTrigger>
                                                    <DropdownMenuContent align="end">
                                                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                                        <DropdownMenuItem
                                                            onClick={() => handleView(item.id)}
                                                        >
                                                            <Eye className="h-4 w-4 mr-2" />
                                                            View
                                                        </DropdownMenuItem>
                                                        <DropdownMenuItem
                                                            onClick={() => handleEdit(item.id)}
                                                        >
                                                            <Edit className="h-4 w-4 mr-2" />
                                                            Edit
                                                        </DropdownMenuItem>
                                                        <DropdownMenuItem
                                                            onClick={() => handleSendEmail(item.id)}
                                                        >
                                                            <Send className="h-4 w-4 mr-2" />
                                                            Send Mail
                                                        </DropdownMenuItem>
                                                        <DropdownMenuSeparator />
                                                        <DropdownMenuItem
                                                            onClick={() => handleDelete(item.id)}
                                                            className="text-destructive"
                                                        >
                                                            <Trash2 className="h-4 w-4 mr-2" />
                                                            Delete
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
                            This action cannot be undone. This will permanently delete this subscriber
                            from the mailing list.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                            onClick={confirmDelete}
                            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                        >
                            Delete Subscriber
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    )
}

function EmailListLoading() {
    return (
        <div className="space-y-6">
            <div className="h-12" />

            <div className="flex items-center justify-between">
                <div className="space-y-2">
                    <div className="h-9 w-[250px] bg-muted animate-pulse rounded" />
                    <div className="h-4 w-[350px] bg-muted animate-pulse rounded" />
                </div>
                <div className="flex items-center gap-2">
                    <div className="h-9 w-[100px] bg-muted animate-pulse rounded" />
                    <div className="h-9 w-[140px] bg-muted animate-pulse rounded" />
                </div>
            </div>

            <Card>
                <CardHeader className="border-b">
                    <div className="flex items-center justify-between">
                        <div className="h-6 w-[120px] bg-muted animate-pulse rounded" />
                        <div className="h-9 w-[250px] bg-muted animate-pulse rounded" />
                    </div>
                </CardHeader>
                <CardContent className="p-0">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead className="w-[50px]">
                                    <div className="h-4 w-4 bg-muted animate-pulse rounded" />
                                </TableHead>
                                <TableHead className="min-w-[200px]">
                                    <div className="h-4 w-16 bg-muted animate-pulse rounded" />
                                </TableHead>
                                <TableHead className="min-w-[250px]">
                                    <div className="h-4 w-16 bg-muted animate-pulse rounded" />
                                </TableHead>
                                <TableHead className="w-[100px]">
                                    <div className="h-4 w-16 bg-muted animate-pulse rounded" />
                                </TableHead>
                                <TableHead className="w-[150px]">
                                    <div className="h-4 w-16 bg-muted animate-pulse rounded" />
                                </TableHead>
                                <TableHead className="min-w-[150px]">
                                    <div className="h-4 w-20 bg-muted animate-pulse rounded" />
                                </TableHead>
                                <TableHead className="w-[80px]">
                                    <div className="h-4 w-16 bg-muted animate-pulse rounded" />
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
                                        <div className="h-4 w-48 bg-muted animate-pulse rounded" />
                                    </TableCell>
                                    <TableCell>
                                        <div className="h-5 w-16 bg-muted animate-pulse rounded-full" />
                                    </TableCell>
                                    <TableCell>
                                        <div className="h-5 w-20 bg-muted animate-pulse rounded-full" />
                                    </TableCell>
                                    <TableCell>
                                        <div className="h-4 w-24 bg-muted animate-pulse rounded" />
                                    </TableCell>
                                    <TableCell>
                                        <div className="h-8 w-8 bg-muted animate-pulse rounded" />
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    )
}
