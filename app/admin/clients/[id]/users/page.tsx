"use client"

import { useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
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
    User as UserIcon
} from "lucide-react"
import UsersLoading from "./loading"

// Mock data
const mockOwner = {
    id: "owner-1",
    name: "John Doe",
    email: "john.doe@example.com",
    role: "client",
    isEmailVerified: true,
}

const mockMembers = [
    {
        id: "1",
        userId: "user-1",
        status: "active",
        createdAt: "2024-02-15T10:30:00Z",
        user: {
            id: "user-1",
            name: "Sarah Johnson",
            email: "sarah.johnson@example.com",
            role: "client",
            isEmailVerified: true,
        },
    },
    {
        id: "2",
        userId: "user-2",
        status: "active",
        createdAt: "2024-03-20T14:15:00Z",
        user: {
            id: "user-2",
            name: "Michael Chen",
            email: "michael.chen@example.com",
            role: "client",
            isEmailVerified: true,
        },
    },
    {
        id: "3",
        userId: "user-3",
        status: "pending",
        createdAt: "2024-04-10T09:45:00Z",
        user: {
            id: "user-3",
            name: "Emily Rodriguez",
            email: "emily.rodriguez@example.com",
            role: "client",
            isEmailVerified: false,
        },
    },
    {
        id: "4",
        userId: "user-4",
        status: "suspended",
        createdAt: "2024-05-05T16:20:00Z",
        user: {
            id: "user-4",
            name: "David Kim",
            email: "david.kim@example.com",
            role: "client",
            isEmailVerified: true,
        },
    },
]

const mockInvitations = [
    {
        id: "inv-1",
        email: "new.user@example.com",
        status: "pending",
        createdAt: "2024-10-20T10:00:00Z",
        expiresAt: "2024-10-27T10:00:00Z",
        invitedBy: {
            id: "owner-1",
            name: "John Doe",
            email: "john.doe@example.com",
        },
    },
    {
        id: "inv-2",
        email: "another.user@example.com",
        status: "pending",
        createdAt: "2024-10-18T14:30:00Z",
        expiresAt: "2024-10-25T14:30:00Z",
        invitedBy: {
            id: "owner-1",
            name: "John Doe",
            email: "john.doe@example.com",
        },
    },
    {
        id: "inv-3",
        email: "expired@example.com",
        status: "expired",
        createdAt: "2024-10-01T09:00:00Z",
        expiresAt: "2024-10-08T09:00:00Z",
        invitedBy: {
            id: "user-1",
            name: "Sarah Johnson",
            email: "sarah.johnson@example.com",
        },
    },
]

const mockOrganization = {
    id: "org-1",
    name: "Test Organization",
    slug: "test-organization",
}

export default function OrganizationUsersPage() {
    const params = useParams()
    const router = useRouter()
    const organizationId = params.id as string

    const [isLoading, setIsLoading] = useState(false)

    const stats = {
        total: mockMembers.length + 1, // +1 for owner
        active: mockMembers.filter(m => m.status === "active").length + 1,
        pending: mockMembers.filter(m => m.status === "pending").length,
        pendingInvitations: mockInvitations.filter(i => i.status === "pending").length,
    }

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

    if (isLoading) {
        return <UsersLoading />
    }

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
                        {mockOrganization.name} - Team Members
                    </h1>
                    <p className="text-muted-foreground">
                        Manage team access, permissions, and invitations
                    </p>
                </div>
                <Button onClick={() => router.push(`/admin/clients/${organizationId}/invite`)}>
                    <UserPlus className="h-4 w-4 mr-2" />
                    Invite User
                </Button>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                <Card>
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

                <Card>
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

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Pending</CardTitle>
                        <Clock className="h-4 w-4 text-yellow-600" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats.pending + stats.pendingInvitations}</div>
                        <p className="text-xs text-muted-foreground mt-1">
                            {stats.pending} members, {stats.pendingInvitations} invitations
                        </p>
                    </CardContent>
                </Card>
            </div>

            <div className="grid gap-6 lg:grid-cols-2">
                <Card>
                    <CardHeader>
                        <CardTitle>Organization Owner & Members</CardTitle>
                        <CardDescription>Manage team access and permissions</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        {/* Owner */}
                        <div className="p-4 border-2 border-primary/20 rounded-lg bg-primary/5">
                            <div className="flex items-center gap-4">
                                <Avatar className="h-12 w-12 ring-2 ring-primary shadow-sm">
                                    <AvatarImage src={undefined} />
                                    <AvatarFallback className="bg-primary text-primary-foreground font-semibold">
                                        {getInitials(mockOwner.name)}
                                    </AvatarFallback>
                                </Avatar>
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-2">
                                        <p className="text-sm font-semibold">{mockOwner.name}</p>
                                        <Badge variant="default" className="text-xs">
                                            <Shield className="h-3 w-3 mr-1" />
                                            Owner
                                        </Badge>
                                    </div>
                                    <p className="text-xs text-muted-foreground">{mockOwner.email}</p>
                                    <div className="flex items-center gap-2 mt-1">
                                        {mockOwner.isEmailVerified ? (
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
                                            {mockOwner.role}
                                        </Badge>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Members */}
                        {mockMembers.length > 0 ? (
                            <div className="space-y-2">
                                <h3 className="text-sm font-semibold">Team Members ({mockMembers.length})</h3>
                                {mockMembers.map((orgUser) => {
                                    const statusConfig = getStatusBadge(orgUser.status)
                                    const StatusIcon = statusConfig.icon

                                    return (
                                        <div key={orgUser.id} className="flex items-center gap-4 p-3 border rounded-lg hover:bg-accent/50 transition-colors">
                                            <Avatar className="h-10 w-10">
                                                <AvatarImage src={undefined} />
                                                <AvatarFallback className="bg-gradient-to-br from-primary/20 to-primary/10 text-sm font-semibold">
                                                    {getInitials(orgUser.user.name)}
                                                </AvatarFallback>
                                            </Avatar>
                                            <div className="flex-1 min-w-0">
                                                <p className="text-sm font-medium">{orgUser.user.name}</p>
                                                <p className="text-xs text-muted-foreground">{orgUser.user.email}</p>
                                                <div className="flex items-center gap-2 mt-1">
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
                                                    {orgUser.user.isEmailVerified && (
                                                        <Badge variant="outline" className="text-xs bg-green-500/10 text-green-700 border-green-500/20">
                                                            <CheckCircle2 className="h-3 w-3 mr-1" />
                                                            Verified
                                                        </Badge>
                                                    )}
                                                </div>
                                            </div>
                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild>
                                                    <Button variant="ghost" size="icon">
                                                        <MoreVertical className="h-4 w-4" />
                                                    </Button>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent align="end">
                                                    <DropdownMenuItem>View Details</DropdownMenuItem>
                                                    <DropdownMenuItem>Change Status</DropdownMenuItem>
                                                    <DropdownMenuItem className="text-destructive">Remove User</DropdownMenuItem>
                                                </DropdownMenuContent>
                                            </DropdownMenu>
                                        </div>
                                    )
                                })}
                            </div>
                        ) : (
                            <div className="text-center py-8 border border-dashed rounded-lg">
                                <UserIcon className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
                                <p className="text-sm text-muted-foreground">No team members yet</p>
                                <Button 
                                    variant="link" 
                                    size="sm" 
                                    className="mt-2" 
                                    onClick={() => router.push(`/admin/clients/${organizationId}/invite`)}
                                >
                                    Invite your first member
                                </Button>
                            </div>
                        )}
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Pending Invitations</CardTitle>
                        <CardDescription>Outstanding invitations to join the organization</CardDescription>
                    </CardHeader>
                    <CardContent>
                        {mockInvitations.length > 0 ? (
                            <div className="space-y-2">
                                {mockInvitations.map((invitation) => {
                                    const statusConfig = getStatusBadge(invitation.status)
                                    const StatusIcon = statusConfig.icon

                                    return (
                                        <div 
                                            key={invitation.id} 
                                            className={`flex items-center gap-4 p-3 rounded-lg ${
                                                invitation.status === "pending" 
                                                    ? "border border-dashed" 
                                                    : "border opacity-60"
                                            }`}
                                        >
                                            <Mail className="h-5 w-5 text-muted-foreground flex-shrink-0" />
                                            <div className="flex-1 min-w-0">
                                                <p className="text-sm font-medium">{invitation.email}</p>
                                                <p className="text-xs text-muted-foreground">
                                                    Invited by {invitation.invitedBy.name} • {formatDate(invitation.createdAt)}
                                                </p>
                                                {invitation.status === "pending" && (
                                                    <p className="text-xs text-muted-foreground mt-1">
                                                        Expires {formatDate(invitation.expiresAt)}
                                                    </p>
                                                )}
                                            </div>
                                            <Badge 
                                                variant="outline" 
                                                className={`text-xs ${statusConfig.className} flex-shrink-0`}
                                            >
                                                <StatusIcon className="h-3 w-3 mr-1" />
                                                {statusConfig.label}
                                            </Badge>
                                        </div>
                                    )
                                })}
                            </div>
                        ) : (
                            <div className="text-center py-8 border border-dashed rounded-lg">
                                <Mail className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
                                <p className="text-sm text-muted-foreground">No pending invitations</p>
                                <Button 
                                    variant="link" 
                                    size="sm" 
                                    className="mt-2"
                                    onClick={() => router.push(`/admin/clients/${organizationId}/invite`)}
                                >
                                    Send an invitation
                                </Button>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
