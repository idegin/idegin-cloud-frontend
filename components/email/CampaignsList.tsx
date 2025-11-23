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
    Megaphone,
    MoreHorizontal,
    RefreshCw,
    Search,
    Plus,
    Edit,
    Trash2,
    Eye,
    Send,
    ArrowLeft,
    MousePointerClick,
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

export interface Campaign {
    id: string
    name: string
    description: string
    clicks: number
    status: "draft" | "scheduled" | "sent" | "active"
    createdAt: string
    updatedAt: string
}

interface CampaignsListProps {
    campaigns?: Campaign[]
    isLoading?: boolean
    error?: Error | null
    onRefresh?: () => void
    onSearch?: (query: string) => void
    onBack?: () => void
    projectId: string
    baseUrl?: string
}

const mockCampaigns: Campaign[] = [
    {
        id: "1",
        name: "Welcome Series",
        description: "Automated welcome email sequence for new subscribers",
        clicks: 1247,
        status: "active",
        createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
        updatedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    },
    {
        id: "2",
        name: "Monthly Newsletter",
        description: "Regular monthly updates and product announcements",
        clicks: 3892,
        status: "sent",
        createdAt: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000).toISOString(),
        updatedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    },
    {
        id: "3",
        name: "Black Friday Sale",
        description: "Special promotional campaign for Black Friday deals",
        clicks: 5621,
        status: "sent",
        createdAt: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000).toISOString(),
        updatedAt: new Date(Date.now() - 85 * 24 * 60 * 60 * 1000).toISOString(),
    },
    {
        id: "4",
        name: "Product Launch",
        description: "New product announcement campaign",
        clicks: 892,
        status: "scheduled",
        createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
        updatedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    },
    {
        id: "5",
        name: "Re-engagement Campaign",
        description: "Win back inactive subscribers",
        clicks: 0,
        status: "draft",
        createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
        updatedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    },
]

export default function CampaignsList({
    campaigns = mockCampaigns,
    isLoading = false,
    error = null,
    onRefresh,
    onSearch,
    onBack,
    projectId,
    baseUrl,
}: CampaignsListProps) {
    const router = useRouter()
    const [searchQuery, setSearchQuery] = useState("")
    const [selectedItems, setSelectedItems] = useState<string[]>([])
    const [showDeleteDialog, setShowDeleteDialog] = useState(false)
    const [itemToDelete, setItemToDelete] = useState<string | null>(null)

    const debouncedSearch = useDebounce(searchQuery, 500)

    const campaignsUrl = baseUrl || `/dashboard/projects/${projectId}`

    React.useEffect(() => {
        if (onSearch) {
            onSearch(debouncedSearch)
        }
    }, [debouncedSearch, onSearch])

    const filteredCampaigns = useMemo(() => {
        if (!debouncedSearch) return campaigns

        return campaigns.filter(
            (item) =>
                item.name.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
                item.description.toLowerCase().includes(debouncedSearch.toLowerCase())
        )
    }, [campaigns, debouncedSearch])

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
                setSelectedItems(filteredCampaigns.map((item) => item.id))
            } else {
                setSelectedItems([])
            }
        },
        [filteredCampaigns]
    )

    const handleSelectItem = useCallback((id: string, checked: boolean) => {
        if (checked) {
            setSelectedItems((prev) => [...prev, id])
        } else {
            setSelectedItems((prev) => prev.filter((item) => item !== id))
        }
    }, [])

    const handleBulkDelete = useCallback(() => {
        console.log("Delete campaigns:", selectedItems)
        setSelectedItems([])
    }, [selectedItems])

    const handleView = useCallback(
        (id: string) => {
            console.log("View campaign:", id)
        },
        []
    )

    const handleEdit = useCallback(
        (id: string) => {
            router.push(`${campaignsUrl}/campaigns/${id}/edit`)
        },
        [router, campaignsUrl]
    )

    const handleDuplicate = useCallback(
        (id: string) => {
            console.log("Duplicate campaign:", id)
        },
        []
    )

    const handleDelete = useCallback((id: string) => {
        setItemToDelete(id)
        setShowDeleteDialog(true)
    }, [])

    const confirmDelete = useCallback(() => {
        if (itemToDelete) {
            console.log("Delete campaign:", itemToDelete)
            setItemToDelete(null)
        }
        setShowDeleteDialog(false)
    }, [itemToDelete])

    const getStatusBadge = (status: Campaign["status"]) => {
        const statusConfig = {
            draft: "bg-gray-500/10 text-gray-700 dark:text-gray-400 border-gray-500/20",
            scheduled: "bg-blue-500/10 text-blue-700 dark:text-blue-400 border-blue-500/20",
            sent: "bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-500/20",
            active: "bg-purple-500/10 text-purple-700 dark:text-purple-400 border-purple-500/20",
        }

        return (
            <Badge variant="outline" className={statusConfig[status]}>
                {status.charAt(0).toUpperCase() + status.slice(1)}
            </Badge>
        )
    }

    if (error) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <SectionPlaceholder
                    variant="error"
                    title="Failed to load campaigns"
                    description="We encountered an error while fetching campaigns. Please try again."
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
                            Back to Email
                        </Button>
                    )}
                    <h1 className="text-3xl font-bold tracking-tight">Campaigns</h1>
                    <p className="text-muted-foreground mt-1">
                        Manage your email marketing campaigns
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
                    <Button size="sm" className="gap-2">
                        <Plus className="h-4 w-4" />
                        Create Campaign
                    </Button>
                </div>
            </div>

            <Card>
                <CardHeader className="border-b">
                    <div className="flex items-center justify-between">
                        <CardTitle>All Campaigns</CardTitle>
                        <div className="relative w-64">
                            <Search className="absolute left-2 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                            <Input
                                placeholder="Search campaigns..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="pl-8"
                            />
                        </div>
                    </div>
                </CardHeader>
                <CardContent className="p-0">
                    {filteredCampaigns.length === 0 ? (
                        <div className="py-12">
                            <SectionPlaceholder
                                variant={searchQuery ? "info" : "default"}
                                icon={Megaphone}
                                title={searchQuery ? "No campaigns found" : "No campaigns yet"}
                                description={
                                    searchQuery
                                        ? "Try adjusting your search query"
                                        : "Create your first campaign to get started"
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
                                                    selectedItems.length === filteredCampaigns.length &&
                                                    filteredCampaigns.length > 0
                                                }
                                                onCheckedChange={handleSelectAll}
                                                aria-label="Select all"
                                            />
                                        </TableHead>
                                        <TableHead className="min-w-[200px]">Name</TableHead>
                                        <TableHead className="min-w-[300px]">Description</TableHead>
                                        <TableHead className="w-[120px]">Clicks</TableHead>
                                        <TableHead className="w-[120px]">Status</TableHead>
                                        <TableHead className="min-w-[150px]">Created</TableHead>
                                        <TableHead className="min-w-[150px]">Last Updated</TableHead>
                                        <TableHead className="w-[80px]">Actions</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {filteredCampaigns.map((campaign) => (
                                        <TableRow key={campaign.id}>
                                            <TableCell onClick={(e) => e.stopPropagation()}>
                                                <Checkbox
                                                    checked={selectedItems.includes(campaign.id)}
                                                    onCheckedChange={(checked) =>
                                                        handleSelectItem(campaign.id, checked as boolean)
                                                    }
                                                    aria-label={`Select ${campaign.name}`}
                                                />
                                            </TableCell>
                                            <TableCell className="font-medium">{campaign.name}</TableCell>
                                            <TableCell className="text-muted-foreground">
                                                {campaign.description}
                                            </TableCell>
                                            <TableCell>
                                                <div className="flex items-center gap-2">
                                                    <MousePointerClick className="h-4 w-4 text-muted-foreground" />
                                                    <span className="font-medium">{campaign.clicks.toLocaleString()}</span>
                                                </div>
                                            </TableCell>
                                            <TableCell>{getStatusBadge(campaign.status)}</TableCell>
                                            <TableCell className="text-sm text-muted-foreground">
                                                {formatDate(campaign.createdAt)}
                                            </TableCell>
                                            <TableCell className="text-sm text-muted-foreground">
                                                {formatDate(campaign.updatedAt)}
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
                                                            onClick={() => handleView(campaign.id)}
                                                        >
                                                            <Eye className="h-4 w-4 mr-2" />
                                                            View
                                                        </DropdownMenuItem>
                                                        <DropdownMenuItem
                                                            onClick={() => handleEdit(campaign.id)}
                                                        >
                                                            <Edit className="h-4 w-4 mr-2" />
                                                            Edit
                                                        </DropdownMenuItem>
                                                        <DropdownMenuItem
                                                            onClick={() => handleDuplicate(campaign.id)}
                                                        >
                                                            <Send className="h-4 w-4 mr-2" />
                                                            Duplicate
                                                        </DropdownMenuItem>
                                                        <DropdownMenuSeparator />
                                                        <DropdownMenuItem
                                                            onClick={() => handleDelete(campaign.id)}
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
                            This action cannot be undone. This will permanently delete this campaign
                            and all associated data.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                            onClick={confirmDelete}
                            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                        >
                            Delete Campaign
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    )
}
