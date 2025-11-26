"use client"

import { useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
    ArrowLeft,
    Calendar,
    Clock,
    CheckCircle2,
    AlertCircle,
    Activity,
    Server,
    ExternalLink,
    Copy,
    Eye,
    EyeOff,
    MoreVertical,
    Edit,
    CreditCard,
    Trash2,
    Ban,
    Power,
    RefreshCw,
    ChevronRight,
    Database,
    HardDrive,
    Folder,
    FileText
} from "lucide-react"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuSub,
    DropdownMenuSubContent,
    DropdownMenuSubTrigger,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useToast } from "@/hooks/use-toast"
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
import ProjectDetailsLoading from "./loading"
import AdminProjectIntegration from "./components/admin-project-integration"
import { SectionPlaceholder } from "@/components/shared/section-placeholder"
import { useProjectFullDetails, useToggleProjectBilling, useUpdateProjectStatus } from "@/lib/hooks/use-projects"

export default function ProjectDetailsPage() {
    const params = useParams()
    const router = useRouter()
    const { toast } = useToast()
    const organizationId = params.id as string
    const projectId = params.projectId as string

    const [showSecretKey, setShowSecretKey] = useState(false)
    const [showBillingDialog, setShowBillingDialog] = useState(false)
    const [billingAction, setBillingAction] = useState<'enable' | 'disable'>('enable')
    const [showStatusDialog, setShowStatusDialog] = useState(false)
    const [selectedStatus, setSelectedStatus] = useState<'active' | 'in_dev' | 'suspended'>('active')

    const { data, isLoading, error, refetch } = useProjectFullDetails(projectId)
    const toggleBillingMutation = useToggleProjectBilling()
    const updateStatusMutation = useUpdateProjectStatus()

    const getStatusConfig = (status: string) => {
        switch (status) {
            case "active":
                return {
                    icon: CheckCircle2,
                    label: "Active",
                    className: "bg-green-500/10 text-green-700 dark:text-green-400 border-green-500/20"
                }
            case "in_dev":
                return {
                    icon: Clock,
                    label: "In Development",
                    className: "bg-blue-500/10 text-blue-700 dark:text-blue-400 border-blue-500/20"
                }
            case "suspended":
                return {
                    icon: AlertCircle,
                    label: "Suspended",
                    className: "bg-red-500/10 text-red-700 dark:text-red-400 border-red-500/20"
                }
            default:
                return {
                    icon: Activity,
                    label: status,
                    className: "bg-muted"
                }
        }
    }

    const formatDate = (date: string) => {
        return new Date(date).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        })
    }

    const formatDateTime = (date: string) => {
        return new Date(date).toLocaleString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        })
    }

    const copyToClipboard = (text: string, label: string) => {
        navigator.clipboard.writeText(text)
        toast({
            title: "Copied!",
            description: `${label} has been copied to clipboard.`,
        })
    }

    const handleEdit = () => {
        router.push(`/admin/clients/${organizationId}/projects/${projectId}/edit`)
    }

    const handleToggleBilling = () => {
        if (!data?.project) return
        
        const action = data.project.is_payment_active ? 'disable' : 'enable'
        setBillingAction(action)
        setShowBillingDialog(true)
    }

    const confirmToggleBilling = async () => {
        if (!data?.project) return

        const newStatus = !data.project.is_payment_active

        try {
            await toggleBillingMutation.mutateAsync({
                id: projectId,
                isActive: newStatus,
            })

            toast({
                title: "Success",
                description: `Billing has been ${newStatus ? 'enabled' : 'disabled'} for this project.`,
            })

            // Refetch to get updated data
            refetch()
        } catch (error: any) {
            toast({
                title: "Error",
                description: error.response?.data?.message || "Failed to update billing status. Please try again.",
                variant: "destructive",
            })
        } finally {
            setShowBillingDialog(false)
        }
    }

    const handleStatusChange = (status: 'active' | 'in_dev' | 'suspended') => {
        setSelectedStatus(status)
        setShowStatusDialog(true)
    }

    const confirmStatusChange = async () => {
        if (!data?.project) return

        try {
            await updateStatusMutation.mutateAsync({
                id: projectId,
                status: selectedStatus,
            })

            toast({
                title: "Success",
                description: `Project status has been updated to ${selectedStatus === 'in_dev' ? 'In Development' : selectedStatus === 'active' ? 'Active' : 'Suspended'}.`,
            })

            // Refetch to get updated data
            refetch()
        } catch (error: any) {
            toast({
                title: "Error",
                description: error.response?.data?.message || "Failed to update project status. Please try again.",
                variant: "destructive",
            })
        } finally {
            setShowStatusDialog(false)
        }
    }

    const handleRefresh = () => {
        refetch()
        toast({
            title: "Refreshed",
            description: "Project data has been refreshed.",
        })
    }

    const handleDelete = () => {
        toast({
            title: "Coming Soon",
            description: "Project deletion will be available soon.",
            variant: "destructive"
        })
    }

    if (isLoading) {
        return <ProjectDetailsLoading />
    }

    if (error) {
        return (
            <div className="space-y-6">
                <Button
                    variant="ghost"
                    onClick={() => router.push(`/admin/clients/${organizationId}/projects`)}
                    className="mb-2 -ml-2"
                >
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Go back
                </Button>
                <SectionPlaceholder
                    variant="error"
                    title="Failed to load project details"
                    description="There was an error loading the project details. Please try again."
                    action={{
                        label: "Try Again",
                        onClick: () => refetch(),
                    }}
                    secondaryAction={{
                        label: "Go Back",
                        onClick: () => router.push(`/admin/clients/${organizationId}/projects`),
                        variant: "outline"
                    }}
                />
            </div>
        )
    }

    if (!data || !data.project) {
        return (
            <div className="space-y-6">
                <Button
                    variant="ghost"
                    onClick={() => router.push(`/admin/clients/${organizationId}/projects`)}
                    className="mb-2 -ml-2"
                >
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Go back
                </Button>
                <SectionPlaceholder
                    variant="info"
                    title="Project not found"
                    description="The project you're looking for doesn't exist or you don't have access to it."
                    action={{
                        label: "Go Back",
                        onClick: () => router.push(`/admin/clients/${organizationId}/projects`),
                    }}
                />
            </div>
        )
    }

    const { project } = data
    const statusConfig = getStatusConfig(project.status)
    const StatusIcon = statusConfig.icon

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="space-y-1">
                <Button
                    variant="ghost"
                    onClick={() => router.push(`/admin/clients/${organizationId}/projects`)}
                    className="mb-2 -ml-2"
                >
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Go back
                </Button>
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <h1 className="text-3xl font-bold tracking-tight">
                            {project.projectName}
                        </h1>
                        <Badge variant="outline" className={statusConfig.className}>
                            <StatusIcon className="h-3 w-3 mr-1" />
                            {statusConfig.label}
                        </Badge>
                    </div>
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="outline" size="icon">
                                <MoreVertical className="h-4 w-4" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-56">
                            <DropdownMenuItem onClick={handleEdit}>
                                <Edit className="h-4 w-4 mr-2" />
                                Edit Project
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={handleToggleBilling}>
                                <CreditCard className="h-4 w-4 mr-2" />
                                {project.is_payment_active ? 'Disable Billing' : 'Enable Billing'}
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuSub>
                                <DropdownMenuSubTrigger>
                                    <Activity className="h-4 w-4 mr-2" />
                                    Change Status
                                </DropdownMenuSubTrigger>
                                <DropdownMenuSubContent>
                                    <DropdownMenuItem 
                                        onClick={() => handleStatusChange('active')}
                                        disabled={project.status === 'active'}
                                    >
                                        <CheckCircle2 className="h-4 w-4 mr-2" />
                                        Active
                                    </DropdownMenuItem>
                                    <DropdownMenuItem 
                                        onClick={() => handleStatusChange('in_dev')}
                                        disabled={project.status === 'in_dev'}
                                    >
                                        <Clock className="h-4 w-4 mr-2" />
                                        In Development
                                    </DropdownMenuItem>
                                    <DropdownMenuItem 
                                        onClick={() => handleStatusChange('suspended')}
                                        disabled={project.status === 'suspended'}
                                    >
                                        <Ban className="h-4 w-4 mr-2" />
                                        Suspended
                                    </DropdownMenuItem>
                                </DropdownMenuSubContent>
                            </DropdownMenuSub>
                            <DropdownMenuItem onClick={handleRefresh}>
                                <RefreshCw className="h-4 w-4 mr-2" />
                                Refresh Data
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem 
                                onClick={handleDelete}
                                className="text-destructive focus:text-destructive"
                            >
                                <Trash2 className="h-4 w-4 mr-2" />
                                Delete Project
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
                <p className="text-muted-foreground">
                    {project.description}
                </p>
            </div>

            <AdminProjectIntegration 
                integrationSettings={{
                    enableCms: project.enableCms ?? true,
                    enableEmailMarketing: project.enableEmailMarketing ?? true,
                    enableCrm: project.enableCrm ?? true,
                }}
            />

            <div className="grid gap-6 lg:grid-cols-2">
                {/* Storage Usage Card */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <HardDrive className="h-5 w-5 text-primary" />
                            Storage Usage
                        </CardTitle>
                        <CardDescription>Track storage consumption and limits</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        {data.storage ? (
                            <>
                                <div className="space-y-2">
                                    <div className="flex items-center justify-between text-sm">
                                        <span className="text-muted-foreground">Used Storage</span>
                                        <span className="font-semibold">
                                            {data.storage.usedGB.toFixed(2)} GB / {data.storage.maxGB} GB
                                        </span>
                                    </div>
                                    <div className="w-full bg-muted rounded-full h-2.5">
                                        <div 
                                            className={`h-2.5 rounded-full transition-all ${
                                                data.storage.percentageUsed > 90 
                                                    ? 'bg-destructive' 
                                                    : data.storage.percentageUsed > 75 
                                                    ? 'bg-amber-500' 
                                                    : 'bg-primary'
                                            }`}
                                            style={{ width: `${Math.min(data.storage.percentageUsed, 100)}%` }}
                                        />
                                    </div>
                                    <p className="text-xs text-muted-foreground">
                                        {data.storage.percentageUsed.toFixed(1)}% of total storage used
                                    </p>
                                </div>
                                {data.storage.percentageUsed > 90 && (
                                    <div className="rounded-lg border border-destructive/20 bg-destructive/10 p-3">
                                        <div className="flex items-start gap-2">
                                            <AlertCircle className="h-4 w-4 text-destructive mt-0.5 flex-shrink-0" />
                                            <div className="flex-1">
                                                <p className="text-sm font-medium text-destructive">Storage Almost Full</p>
                                                <p className="text-xs text-destructive/80 mt-1">
                                                    Consider upgrading your storage plan or deleting unused files.
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </>
                        ) : (
                            <p className="text-sm text-muted-foreground">Storage data unavailable</p>
                        )}
                    </CardContent>
                </Card>

                {/* CMS Statistics Card */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Database className="h-5 w-5 text-primary" />
                            CMS Statistics
                        </CardTitle>
                        <CardDescription>Content management system overview</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        {data.cms ? (
                            <>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <div className="flex items-center gap-2">
                                            <Folder className="h-4 w-4 text-muted-foreground" />
                                            <span className="text-sm text-muted-foreground">Collections</span>
                                        </div>
                                        <p className="text-2xl font-bold">{data.cms.collectionsCount}</p>
                                    </div>
                                    <div className="space-y-2">
                                        <div className="flex items-center gap-2">
                                            <FileText className="h-4 w-4 text-muted-foreground" />
                                            <span className="text-sm text-muted-foreground">Entries</span>
                                        </div>
                                        <p className="text-2xl font-bold">{data.cms.entriesCount}</p>
                                    </div>
                                </div>
                                <Button 
                                    variant="outline" 
                                    className="w-full"
                                    onClick={() => router.push(`/admin/clients/${organizationId}/projects/${projectId}/cms`)}
                                >
                                    <Database className="h-4 w-4 mr-2" />
                                    Manage CMS Content
                                    <ChevronRight className="h-4 w-4 ml-auto" />
                                </Button>
                            </>
                        ) : (
                            <p className="text-sm text-muted-foreground">CMS data unavailable</p>
                        )}
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Project Details</CardTitle>
                        <CardDescription>General information and configuration</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div>
                            <p className="text-sm text-muted-foreground mb-1">Project ID</p>
                            <p className="font-mono text-sm">{project.id}</p>
                        </div>
                        <div>
                            <p className="text-sm text-muted-foreground mb-1">Organization</p>
                            <p className="font-medium">{project.organization?.name || 'N/A'}</p>
                        </div>
                        <div>
                            <p className="text-sm text-muted-foreground mb-1">Created</p>
                            <div className="flex items-center gap-2">
                                <Calendar className="h-4 w-4 text-muted-foreground" />
                                <p className="font-medium">{formatDate(project.createdAt)}</p>
                            </div>
                        </div>
                        <div>
                            <p className="text-sm text-muted-foreground mb-1">Last Updated</p>
                            <div className="flex items-center gap-2">
                                <Clock className="h-4 w-4 text-muted-foreground" />
                                <p className="font-medium">{formatDateTime(project.updatedAt)}</p>
                            </div>
                        </div>
                        <div>
                            <p className="text-sm text-muted-foreground mb-1">Payment Status</p>
                            <Badge 
                                variant="outline" 
                                className={project.is_payment_active ? 'bg-green-500/10 text-green-700 border-green-500/20' : 'bg-red-500/10 text-red-700 border-red-500/20'}
                            >
                                {project.is_payment_active ? 'Active' : 'Inactive'}
                            </Badge>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Hosting Provider</CardTitle>
                        <CardDescription>Infrastructure and deployment details</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        {project.providers && project.providers.length > 0 ? (
                            project.providers.map((provider: any) => (
                                <div key={provider.id} className="p-4 border rounded-lg space-y-3">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-2">
                                            <Server className="h-5 w-5 text-primary" />
                                            <span className="font-semibold capitalize">{provider.type}</span>
                                        </div>
                                        <Badge variant="outline" className="bg-green-500/10 text-green-700 border-green-500/20">
                                            <CheckCircle2 className="h-3 w-3 mr-1" />
                                            Active
                                        </Badge>
                                    </div>
                                    {provider.appName && (
                                        <div className="space-y-2 text-sm">
                                            <div className="flex justify-between">
                                                <span className="text-muted-foreground">App Name:</span>
                                                <span className="font-mono">{provider.appName}</span>
                                            </div>
                                        </div>
                                    )}
                                    {provider.type === 'fly.io' && provider.appName && (
                                        <Button 
                                            variant="outline" 
                                            size="sm" 
                                            className="w-full"
                                            onClick={() => window.open(`https://fly.io/apps/${provider.appName}`, '_blank')}
                                        >
                                            <ExternalLink className="h-4 w-4 mr-2" />
                                            View on Fly.io
                                        </Button>
                                    )}
                                </div>
                            ))
                        ) : (
                            <p className="text-sm text-muted-foreground text-center py-8">
                                No hosting providers configured
                            </p>
                        )}
                    </CardContent>
                </Card>
            </div>

            {/* API Keys */}
            <Card>
                <CardHeader>
                    <CardTitle>API Key</CardTitle>
                    <CardDescription>Secret key for API access and authentication</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div>
                        <p className="text-sm text-muted-foreground mb-2">Secret Key</p>
                        <div className="flex items-center gap-2">
                            <code className="flex-1 p-3 bg-muted rounded font-mono text-sm break-all">
                                {showSecretKey ? project.secretKey : project.secretKey.replace(/./g, '•')}
                            </code>
                            <Button 
                                variant="outline" 
                                size="sm"
                                onClick={() => setShowSecretKey(!showSecretKey)}
                            >
                                {showSecretKey ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                            </Button>
                            <Button 
                                variant="outline" 
                                size="sm"
                                onClick={() => copyToClipboard(project.secretKey, 'Secret key')}
                            >
                                <Copy className="h-4 w-4" />
                            </Button>
                        </div>
                    </div>
                    <div className="rounded-lg border border-amber-200 bg-amber-50 p-4">
                        <div className="flex items-start gap-3">
                            <div className="flex-shrink-0">
                                <svg className="h-5 w-5 text-amber-600" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                                </svg>
                            </div>
                            <div className="flex-1">
                                <h4 className="text-sm font-semibold text-amber-800 mb-1">Security Warning</h4>
                                <p className="text-sm text-amber-700">
                                    Keep your secret key secure and never share it publicly. This key provides full access to your CMS data. 
                                    Store it in environment variables in production and never commit it to version control.
                                </p>
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Billing Confirmation Dialog */}
            <AlertDialog open={showBillingDialog} onOpenChange={setShowBillingDialog}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>
                            {billingAction === 'enable' ? 'Enable' : 'Disable'} Billing?
                        </AlertDialogTitle>
                        <AlertDialogDescription>
                            {billingAction === 'enable' 
                                ? 'Enabling billing will activate automatic charges for this project. The organization wallet will be debited based on the monthly billing amount.'
                                : 'Disabling billing will stop automatic charges for this project. The project will remain operational but no further billing will occur.'
                            }
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction 
                            onClick={confirmToggleBilling}
                            disabled={toggleBillingMutation.isPending}
                        >
                            {toggleBillingMutation.isPending ? 'Processing...' : 'Confirm'}
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>

            {/* Status Change Confirmation Dialog */}
            <AlertDialog open={showStatusDialog} onOpenChange={setShowStatusDialog}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Change Project Status?</AlertDialogTitle>
                        <AlertDialogDescription>
                            You are about to change the project status from{' '}
                            <span className="font-semibold">
                                {project.status === 'active' ? 'Active' : 
                                 project.status === 'in_dev' ? 'In Development' : 'Suspended'}
                            </span>
                            {' '}to{' '}
                            <span className="font-semibold">
                                {selectedStatus === 'active' ? 'Active' : 
                                 selectedStatus === 'in_dev' ? 'In Development' : 'Suspended'}
                            </span>.
                            {selectedStatus === 'suspended' && 
                                ' This will suspend all project activities and may affect service availability.'}
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel disabled={updateStatusMutation.isPending}>
                            Cancel
                        </AlertDialogCancel>
                        <AlertDialogAction 
                            onClick={confirmStatusChange}
                            disabled={updateStatusMutation.isPending}
                        >
                            {updateStatusMutation.isPending ? 'Updating...' : 'Confirm'}
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    )
}
