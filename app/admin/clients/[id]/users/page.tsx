"use client"

import { useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { useSession } from "next-auth/react"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
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
import {
    ArrowLeft,
    Users,
    UserPlus,
    Mail,
    CheckCircle2,
    XCircle,
    Clock,
    MoreVertical,
    Shield,
    User as UserIcon,
    RefreshCw,
    Building2,
    Ban,
    UserCheck,
    Send,
    Trash2,
    Loader2
} from "lucide-react"
import { useOrganization } from "@/lib/hooks/use-organizations"
import { organizationsApi, OrganizationUser, OrganizationInvitation } from "@/lib/api/organizations"
import { SectionPlaceholder } from "@/components/shared/section-placeholder"
import { useToast } from "@/hooks/use-toast"
import UsersLoading from "./loading"

type SuspendDialogState = {
    isOpen: boolean
    type: "owner" | "member" | null
    userId: string | null
    userName: string
    currentStatus: string
    action: "suspend" | "activate"
}

type InvitationDialogState = {
    isOpen: boolean
    type: "resend" | "delete" | null
    invitationId: string | null
    email: string
}

export default function OrganizationUsersPage() {
    const params = useParams()
    const router = useRouter()
    const { toast } = useToast()
    const { data: session } = useSession()
    const queryClient = useQueryClient()
    const organizationId = params.id as string

    const { data, isLoading, error, refetch } = useOrganization(organizationId)

    const [suspendDialog, setSuspendDialog] = useState<SuspendDialogState>({
        isOpen: false,
        type: null,
        userId: null,
        userName: "",
        currentStatus: "",
        action: "suspend",
    })

    const [invitationDialog, setInvitationDialog] = useState<InvitationDialogState>({
        isOpen: false,
        type: null,
        invitationId: null,
        email: "",
    })

    const currentUserRole = session?.user?.role
    const currentUserId = session?.user?.id
    const isAdminUser = currentUserRole === "super_admin" || currentUserRole === "admin"

    const updateOrgUserStatusMutation = useMutation({
        mutationFn: ({ orgUserId, status }: { orgUserId: string; status: "active" | "suspended" }) =>
            organizationsApi.updateOrgUserStatus(organizationId, orgUserId, status),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["organization", organizationId] })
            toast({
                title: "Success",
                description: `User ${suspendDialog.action === "suspend" ? "suspended" : "activated"} successfully`,
            })
            setSuspendDialog({ isOpen: false, type: null, userId: null, userName: "", currentStatus: "", action: "suspend" })
        },
        onError: (error: any) => {
            toast({
                title: "Error",
                description: error?.response?.data?.message || "Failed to update user status",
                variant: "destructive",
            })
        },
    })

    const suspendOwnerMutation = useMutation({
        mutationFn: () => organizationsApi.suspendOwner(organizationId),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["organization", organizationId] })
            toast({
                title: "Success",
                description: "Organization owner suspended successfully",
            })
            setSuspendDialog({ isOpen: false, type: null, userId: null, userName: "", currentStatus: "", action: "suspend" })
        },
        onError: (error: any) => {
            toast({
                title: "Error",
                description: error?.response?.data?.message || "Failed to suspend owner",
                variant: "destructive",
            })
        },
    })

    const activateOwnerMutation = useMutation({
        mutationFn: () => organizationsApi.activateOwner(organizationId),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["organization", organizationId] })
            toast({
                title: "Success",
                description: "Organization owner activated successfully",
            })
            setSuspendDialog({ isOpen: false, type: null, userId: null, userName: "", currentStatus: "", action: "suspend" })
        },
        onError: (error: any) => {
            toast({
                title: "Error",
                description: error?.response?.data?.message || "Failed to activate owner",
                variant: "destructive",
            })
        },
    })

    const resendInvitationMutation = useMutation({
        mutationFn: (invitationId: string) => organizationsApi.resendInvitation(invitationId),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["organization", organizationId] })
            toast({
                title: "Success",
                description: "Invitation resent successfully",
            })
            setInvitationDialog({ isOpen: false, type: null, invitationId: null, email: "" })
        },
        onError: (error: any) => {
            toast({
                title: "Error",
                description: error?.response?.data?.message || "Failed to resend invitation",
                variant: "destructive",
            })
        },
    })

    const deleteInvitationMutation = useMutation({
        mutationFn: (invitationId: string) => organizationsApi.deleteInvitation(invitationId),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["organization", organizationId] })
            toast({
                title: "Success",
                description: "Invitation deleted successfully",
            })
            setInvitationDialog({ isOpen: false, type: null, invitationId: null, email: "" })
        },
        onError: (error: any) => {
            toast({
                title: "Error",
                description: error?.response?.data?.message || "Failed to delete invitation",
                variant: "destructive",
            })
        },
    })

    const getStatusBadge = (status: string) => {
        switch (status) {
            case "active":
                return {
                    icon: CheckCircle2,
                    label: "Active",
                    className: "bg-green-500/10 text-green-700 dark:text-green-400 border-green-500/20"
                }
            case "pending":
                return {
                    icon: Clock,
                    label: "Pending",
                    className: "bg-yellow-500/10 text-yellow-700 dark:text-yellow-400 border-yellow-500/20"
                }
            case "suspended":
                return {
                    icon: XCircle,
                    label: "Suspended",
                    className: "bg-red-500/10 text-red-700 dark:text-red-400 border-red-500/20"
                }
            case "expired":
                return {
                    icon: XCircle,
                    label: "Expired",
                    className: "bg-gray-500/10 text-gray-700 dark:text-gray-400 border-gray-500/20"
                }
            default:
                return {
                    icon: Users,
                    label: status,
                    className: "bg-muted"
                }
        }
    }

    const getInitials = (name: string) => {
        return name
            .split(' ')
            .map(n => n[0])
            .join('')
            .slice(0, 2)
            .toUpperCase()
    }

    const formatDate = (date: string) => {
        return new Date(date).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        })
    }

    const canManageUser = (targetUser: OrganizationUser) => {
        const targetRole = targetUser.user.role
        if (targetRole === "super_admin" || targetRole === "admin") {
            return false
        }
        if (targetUser.user.id === currentUserId) {
            return false
        }
        return true
    }

    const canManageOwner = () => {
        return isAdminUser
    }

    const handleSuspendConfirm = () => {
        if (suspendDialog.type === "owner") {
            if (suspendDialog.action === "suspend") {
                suspendOwnerMutation.mutate()
            } else {
                activateOwnerMutation.mutate()
            }
        } else if (suspendDialog.type === "member" && suspendDialog.userId) {
            updateOrgUserStatusMutation.mutate({
                orgUserId: suspendDialog.userId,
                status: suspendDialog.action === "suspend" ? "suspended" : "active",
            })
        }
    }

    const handleInvitationConfirm = () => {
        if (!invitationDialog.invitationId) return
        if (invitationDialog.type === "resend") {
            resendInvitationMutation.mutate(invitationDialog.invitationId)
        } else if (invitationDialog.type === "delete") {
            deleteInvitationMutation.mutate(invitationDialog.invitationId)
        }
    }

    const openSuspendDialog = (
        type: "owner" | "member",
        userId: string | null,
        userName: string,
        currentStatus: string
    ) => {
        setSuspendDialog({
            isOpen: true,
            type,
            userId,
            userName,
            currentStatus,
            action: currentStatus === "suspended" ? "activate" : "suspend",
        })
    }

    const openInvitationDialog = (type: "resend" | "delete", invitationId: string, email: string) => {
        setInvitationDialog({
            isOpen: true,
            type,
            invitationId,
            email,
        })
    }

    if (isLoading) {
        return <UsersLoading />
    }

    if (error) {
        return (
            <div className="space-y-6">
                <Button
                    variant="ghost"
                    onClick={() => router.push(`/admin/clients/${organizationId}`)}
                    className="mb-4 -ml-2"
                >
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Back to Organization
                </Button>
                <SectionPlaceholder
                    variant="error"
                    icon={Building2}
                    title="Failed to load team members"
                    description="There was an error loading the organization's team members. Please try again."
                    action={{
                        label: "Retry",
                        onClick: () => refetch(),
                    }}
                    secondaryAction={{
                        label: "Go Back",
                        onClick: () => router.push(`/admin/clients/${organizationId}`),
                        variant: "outline"
                    }}
                />
            </div>
        )
    }

    if (!data) {
        return (
            <div className="space-y-6">
                <Button
                    variant="ghost"
                    onClick={() => router.push(`/admin/clients/${organizationId}`)}
                    className="mb-4 -ml-2"
                >
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Back to Organization
                </Button>
                <SectionPlaceholder
                    variant="warning"
                    icon={Building2}
                    title="Organization not found"
                    description="The organization you're looking for doesn't exist or you don't have access to it."
                    action={{
                        label: "View All Organizations",
                        onClick: () => router.push("/admin/clients"),
                    }}
                />
            </div>
        )
    }

    const { organization } = data
    const members = organization.organizationUsers || []
    const invitations = organization.invitations || []
    const ownerOrgUser = members.find(m => m.user.id === organization.owner.id)
    const ownerStatus = ownerOrgUser?.status || "active"
    const isOwnerAdmin = organization.owner.role === "super_admin" || organization.owner.role === "admin"

    const stats = {
        total: members.length + 1,
        active: members.filter(m => m.status === "active").length + (ownerStatus === "active" ? 1 : 0),
        pending: members.filter(m => m.status === "pending").length,
        pendingInvitations: invitations.filter(i => i.status === "pending").length,
    }

    const isMutating = updateOrgUserStatusMutation.isPending ||
        suspendOwnerMutation.isPending ||
        activateOwnerMutation.isPending ||
        resendInvitationMutation.isPending ||
        deleteInvitationMutation.isPending

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div className="space-y-1">
                    <Button
                        variant="ghost"
                        onClick={() => router.push(`/admin/clients/${organizationId}`)}
                        className="mb-2 -ml-2"
                    >
                        <ArrowLeft className="h-4 w-4 mr-2" />
                        Back to Organization
                    </Button>
                    <h1 className="text-3xl font-bold tracking-tight">
                        {organization.name} - Team Members
                    </h1>
                    <p className="text-muted-foreground">
                        Manage team access, permissions, and invitations
                    </p>
                </div>
                <div className="flex items-center gap-2">
                    <Button variant="outline" size="icon" onClick={() => refetch()} disabled={isMutating}>
                        <RefreshCw className={`h-4 w-4 ${isMutating ? "animate-spin" : ""}`} />
                    </Button>
                    <Button onClick={() => router.push(`/admin/clients/${organizationId}/invite`)}>
                        <UserPlus className="h-4 w-4 mr-2" />
                        Invite User
                    </Button>
                </div>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                <Card className="border-l-4 border-l-primary">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Members</CardTitle>
                        <Users className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats.total}</div>
                        <p className="text-xs text-muted-foreground mt-1">
                            Including owner
                        </p>
                    </CardContent>
                </Card>

                <Card className="border-l-4 border-l-green-500">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Active Members</CardTitle>
                        <CheckCircle2 className="h-4 w-4 text-green-600" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats.active}</div>
                        <p className="text-xs text-muted-foreground mt-1">
                            Currently active
                        </p>
                    </CardContent>
                </Card>

                <Card className="border-l-4 border-l-yellow-500">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Pending Members</CardTitle>
                        <Clock className="h-4 w-4 text-yellow-600" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats.pending}</div>
                        <p className="text-xs text-muted-foreground mt-1">
                            Awaiting activation
                        </p>
                    </CardContent>
                </Card>

                <Card className="border-l-4 border-l-blue-500">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Pending Invitations</CardTitle>
                        <Mail className="h-4 w-4 text-blue-600" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats.pendingInvitations}</div>
                        <p className="text-xs text-muted-foreground mt-1">
                            Awaiting response
                        </p>
                    </CardContent>
                </Card>
            </div>

            <div className="grid gap-6 lg:grid-cols-2">
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Users className="h-5 w-5" />
                            Organization Owner & Members
                        </CardTitle>
                        <CardDescription>Manage team access and permissions</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className={`p-4 border-2 rounded-lg ${ownerStatus === "suspended" ? "border-red-500/20 bg-red-500/5" : "border-primary/20 bg-primary/5"}`}>
                            <div className="flex items-center gap-4">
                                <Avatar className={`h-12 w-12 ring-2 shadow-sm ${ownerStatus === "suspended" ? "ring-red-500" : "ring-primary"}`}>
                                    <AvatarImage src={undefined} />
                                    <AvatarFallback className={`font-semibold ${ownerStatus === "suspended" ? "bg-red-500 text-white" : "bg-primary text-primary-foreground"}`}>
                                        {getInitials(organization.owner.name)}
                                    </AvatarFallback>
                                </Avatar>
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-2 flex-wrap">
                                        <p className="text-sm font-semibold">{organization.owner.name}</p>
                                        <Badge variant="default" className="text-xs">
                                            <Shield className="h-3 w-3 mr-1" />
                                            Owner
                                        </Badge>
                                        {ownerStatus === "suspended" && (
                                            <Badge variant="outline" className="text-xs bg-red-500/10 text-red-700 dark:text-red-400 border-red-500/20">
                                                <XCircle className="h-3 w-3 mr-1" />
                                                Suspended
                                            </Badge>
                                        )}
                                    </div>
                                    <p className="text-xs text-muted-foreground truncate">{organization.owner.email}</p>
                                    <div className="flex items-center gap-2 mt-1 flex-wrap">
                                        {organization.owner.isEmailVerified ? (
                                            <Badge variant="outline" className="text-xs bg-green-500/10 text-green-700 dark:text-green-400 border-green-500/20">
                                                <CheckCircle2 className="h-3 w-3 mr-1" />
                                                Verified
                                            </Badge>
                                        ) : (
                                            <Badge variant="outline" className="text-xs bg-yellow-500/10 text-yellow-700 dark:text-yellow-400 border-yellow-500/20">
                                                <Clock className="h-3 w-3 mr-1" />
                                                Unverified
                                            </Badge>
                                        )}
                                        <Badge variant="outline" className="text-xs capitalize">
                                            {organization.owner.role}
                                        </Badge>
                                    </div>
                                </div>
                                {canManageOwner() && !isOwnerAdmin && (
                                    <Button
                                        variant={ownerStatus === "suspended" ? "default" : "destructive"}
                                        size="sm"
                                        onClick={() => openSuspendDialog("owner", null, organization.owner.name, ownerStatus)}
                                        disabled={isMutating}
                                    >
                                        {ownerStatus === "suspended" ? (
                                            <>
                                                <UserCheck className="h-4 w-4 mr-1" />
                                                Activate
                                            </>
                                        ) : (
                                            <>
                                                <Ban className="h-4 w-4 mr-1" />
                                                Suspend
                                            </>
                                        )}
                                    </Button>
                                )}
                            </div>
                        </div>

                        {members.filter(m => m.user.id !== organization.owner.id).length > 0 ? (
                            <div className="space-y-2">
                                <h3 className="text-sm font-semibold text-muted-foreground">
                                    Team Members ({members.filter(m => m.user.id !== organization.owner.id).length})
                                </h3>
                                <div className="space-y-2 max-h-[400px] overflow-y-auto pr-1">
                                    {members.filter(m => m.user.id !== organization.owner.id).map((orgUser) => {
                                        const statusConfig = getStatusBadge(orgUser.status)
                                        const StatusIcon = statusConfig.icon
                                        const canManage = canManageUser(orgUser)
                                        const isAdminTarget = orgUser.user.role === "super_admin" || orgUser.user.role === "admin"

                                        return (
                                            <div key={orgUser.id} className="flex items-center gap-4 p-3 border rounded-lg hover:bg-accent/50 transition-colors group">
                                                <Avatar className="h-10 w-10">
                                                    <AvatarImage src={undefined} />
                                                    <AvatarFallback className="bg-gradient-to-br from-primary/20 to-primary/10 text-sm font-semibold">
                                                        {getInitials(orgUser.user.name)}
                                                    </AvatarFallback>
                                                </Avatar>
                                                <div className="flex-1 min-w-0">
                                                    <p className="text-sm font-medium truncate">{orgUser.user.name}</p>
                                                    <p className="text-xs text-muted-foreground truncate">{orgUser.user.email}</p>
                                                    <div className="flex items-center gap-2 mt-1 flex-wrap">
                                                        <Badge
                                                            variant="outline"
                                                            className={`text-xs ${statusConfig.className}`}
                                                        >
                                                            <StatusIcon className="h-3 w-3 mr-1" />
                                                            {statusConfig.label}
                                                        </Badge>
                                                        <Badge variant="outline" className="text-xs capitalize">
                                                            {orgUser.user.role}
                                                        </Badge>
                                                    </div>
                                                </div>
                                                {canManage && !isAdminTarget && (
                                                    <Button
                                                        variant={orgUser.status === "suspended" ? "outline" : "ghost"}
                                                        size="sm"
                                                        onClick={() => openSuspendDialog("member", orgUser.id, orgUser.user.name, orgUser.status)}
                                                        disabled={isMutating}
                                                        className={orgUser.status === "suspended"
                                                            ? "border-green-500/50 text-green-600 hover:bg-green-500/10"
                                                            : "opacity-0 group-hover:opacity-100 text-destructive hover:text-destructive hover:bg-destructive/10"
                                                        }
                                                    >
                                                        {orgUser.status === "suspended" ? (
                                                            <>
                                                                <UserCheck className="h-4 w-4 mr-1" />
                                                                Activate
                                                            </>
                                                        ) : (
                                                            <>
                                                                <Ban className="h-4 w-4 mr-1" />
                                                                Suspend
                                                            </>
                                                        )}
                                                    </Button>
                                                )}
                                            </div>
                                        )
                                    })}
                                </div>
                            </div>
                        ) : (
                            <div className="text-center py-8 border border-dashed rounded-lg bg-muted/30">
                                <UserIcon className="h-10 w-10 mx-auto text-muted-foreground mb-3" />
                                <p className="text-sm font-medium">No team members yet</p>
                                <p className="text-xs text-muted-foreground mt-1">
                                    Invite users to collaborate on this organization
                                </p>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    className="mt-4"
                                    onClick={() => router.push(`/admin/clients/${organizationId}/invite`)}
                                >
                                    <UserPlus className="h-4 w-4 mr-2" />
                                    Invite your first member
                                </Button>
                            </div>
                        )}
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Mail className="h-5 w-5" />
                            Pending Invitations
                        </CardTitle>
                        <CardDescription>Outstanding invitations to join the organization</CardDescription>
                    </CardHeader>
                    <CardContent>
                        {invitations.length > 0 ? (
                            <div className="space-y-2 max-h-[500px] overflow-y-auto pr-1">
                                {invitations.map((invitation) => {
                                    const statusConfig = getStatusBadge(invitation.status)
                                    const StatusIcon = statusConfig.icon
                                    const isExpired = new Date(invitation.expiresAt) < new Date()
                                    const isPending = invitation.status === "pending" && !isExpired

                                    return (
                                        <div
                                            key={invitation.id}
                                            className={`flex items-center gap-4 p-4 rounded-lg transition-colors group ${isPending
                                                ? "border border-dashed border-primary/30 bg-primary/5 hover:bg-primary/10"
                                                : "border opacity-60"
                                                }`}
                                        >
                                            <div className="h-10 w-10 rounded-full bg-muted flex items-center justify-center flex-shrink-0">
                                                <Mail className="h-5 w-5 text-muted-foreground" />
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <p className="text-sm font-medium truncate">{invitation.email}</p>
                                                <p className="text-xs text-muted-foreground">
                                                    Invited by {invitation.invitedBy.name}
                                                </p>
                                                <p className="text-xs text-muted-foreground mt-0.5">
                                                    {formatDate(invitation.createdAt)}
                                                </p>
                                                {isPending && (
                                                    <p className="text-xs text-yellow-600 dark:text-yellow-400 mt-1">
                                                        Expires {formatDate(invitation.expiresAt)}
                                                    </p>
                                                )}
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <Badge
                                                    variant="outline"
                                                    className={`text-xs flex-shrink-0 ${isExpired && invitation.status === "pending"
                                                        ? "bg-gray-500/10 text-gray-700 dark:text-gray-400 border-gray-500/20"
                                                        : statusConfig.className
                                                        }`}
                                                >
                                                    <StatusIcon className="h-3 w-3 mr-1" />
                                                    {isExpired && invitation.status === "pending" ? "Expired" : statusConfig.label}
                                                </Badge>
                                                {(isPending || isExpired) && (
                                                    <DropdownMenu>
                                                        <DropdownMenuTrigger asChild>
                                                            <Button
                                                                variant="ghost"
                                                                size="icon"
                                                                className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity"
                                                                disabled={isMutating}
                                                            >
                                                                <MoreVertical className="h-4 w-4" />
                                                            </Button>
                                                        </DropdownMenuTrigger>
                                                        <DropdownMenuContent align="end">
                                                            <DropdownMenuItem
                                                                onClick={() => openInvitationDialog("resend", invitation.id, invitation.email)}
                                                            >
                                                                <Send className="h-4 w-4 mr-2" />
                                                                Resend Invitation
                                                            </DropdownMenuItem>
                                                            <DropdownMenuSeparator />
                                                            <DropdownMenuItem
                                                                onClick={() => openInvitationDialog("delete", invitation.id, invitation.email)}
                                                                className="text-destructive focus:text-destructive"
                                                            >
                                                                <Trash2 className="h-4 w-4 mr-2" />
                                                                Delete Invitation
                                                            </DropdownMenuItem>
                                                        </DropdownMenuContent>
                                                    </DropdownMenu>
                                                )}
                                            </div>
                                        </div>
                                    )
                                })}
                            </div>
                        ) : (
                            <div className="text-center py-8 border border-dashed rounded-lg bg-muted/30">
                                <Mail className="h-10 w-10 mx-auto text-muted-foreground mb-3" />
                                <p className="text-sm font-medium">No pending invitations</p>
                                <p className="text-xs text-muted-foreground mt-1">
                                    Send invitations to grow your team
                                </p>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    className="mt-4"
                                    onClick={() => router.push(`/admin/clients/${organizationId}/invite`)}
                                >
                                    <UserPlus className="h-4 w-4 mr-2" />
                                    Send an invitation
                                </Button>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>

            <AlertDialog open={suspendDialog.isOpen} onOpenChange={(open) => !open && setSuspendDialog({ ...suspendDialog, isOpen: false })}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>
                            {suspendDialog.action === "suspend" ? "Suspend User" : "Activate User"}
                        </AlertDialogTitle>
                        <AlertDialogDescription>
                            {suspendDialog.action === "suspend" ? (
                                <>
                                    Are you sure you want to suspend <strong>{suspendDialog.userName}</strong>?
                                    They will no longer be able to access this organization until reactivated.
                                </>
                            ) : (
                                <>
                                    Are you sure you want to activate <strong>{suspendDialog.userName}</strong>?
                                    They will regain access to this organization.
                                </>
                            )}
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel disabled={isMutating}>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                            onClick={handleSuspendConfirm}
                            disabled={isMutating}
                            className={suspendDialog.action === "suspend" ? "bg-destructive hover:bg-destructive/90" : ""}
                        >
                            {isMutating && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                            {suspendDialog.action === "suspend" ? "Suspend" : "Activate"}
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>

            <AlertDialog open={invitationDialog.isOpen} onOpenChange={(open) => !open && setInvitationDialog({ ...invitationDialog, isOpen: false })}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>
                            {invitationDialog.type === "resend" ? "Resend Invitation" : "Delete Invitation"}
                        </AlertDialogTitle>
                        <AlertDialogDescription>
                            {invitationDialog.type === "resend" ? (
                                <>
                                    Are you sure you want to resend the invitation to <strong>{invitationDialog.email}</strong>?
                                    A new invitation email will be sent with a fresh expiration date.
                                </>
                            ) : (
                                <>
                                    Are you sure you want to delete the invitation for <strong>{invitationDialog.email}</strong>?
                                    This action cannot be undone.
                                </>
                            )}
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel disabled={isMutating}>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                            onClick={handleInvitationConfirm}
                            disabled={isMutating}
                            className={invitationDialog.type === "delete" ? "bg-destructive hover:bg-destructive/90" : ""}
                        >
                            {isMutating && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                            {invitationDialog.type === "resend" ? "Resend" : "Delete"}
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    )
}
