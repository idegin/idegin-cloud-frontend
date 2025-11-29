"use client"

import { useParams } from "next/navigation"
import { useRouter } from 'next13-progressbar'
import { useOrganization } from "@/lib/hooks/use-organizations"
import { OrganizationDetailsLoading } from "@/app/admin/clients/components/organization-details-loading"
import { SectionPlaceholder } from "@/components/shared/section-placeholder"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import {
    Building2,
    ArrowLeft,
    Users,
    FolderKanban,
    Wallet,
    TrendingUp,
    Mail,
    UserPlus,
    MoreVertical,
    Clock,
    CheckCircle2,
    XCircle,
    ArrowUpRight,
    ArrowDownRight,
    Calendar,
    DollarSign,
    Activity
} from "lucide-react"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { format } from "date-fns"
import OrgWalletDetails from "./components/OrgWalletDetails"

export default function OrganizationDetailsPage() {
    const params = useParams()
    const router = useRouter()
    const organizationId = params.id as string

    const { data, isLoading, error, refetch } = useOrganization(organizationId)

    if (isLoading) {
        return <OrganizationDetailsLoading />
    }

    if (error) {
        return (
            <div className="space-y-6">
                <Button
                    variant="ghost"
                    onClick={() => router.push("/admin/clients")}
                    className="mb-4"
                >
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Back to Organizations
                </Button>
                <SectionPlaceholder
                    variant="error"
                    icon={Building2}
                    title="Failed to load organization"
                    description="There was an error loading the organization details. Please try again."
                    action={{
                        label: "Retry",
                        onClick: () => refetch(),
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
                    onClick={() => router.push("/admin/clients")}
                    className="mb-4"
                >
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Back to Organizations
                </Button>
                <SectionPlaceholder
                    variant="info"
                    icon={Building2}
                    title="Organization not found"
                    description="The organization you're looking for doesn't exist or has been deleted."
                    action={{
                        label: "Go to Organizations",
                        onClick: () => router.push("/admin/clients"),
                    }}
                />
            </div>
        )
    }

    const { organization, wallet, statistics } = data

    const getInitials = (name: string) => {
        return name
            .split(' ')
            .map(n => n[0])
            .join('')
            .slice(0, 2)
            .toUpperCase()
    }

    const getStatusBadge = (status: string) => {
        const variants = {
            active: { variant: "default" as const, className: "bg-green-500/10 text-green-700 dark:text-green-400 border-green-500/20" },
            pending: { variant: "secondary" as const, className: "bg-yellow-500/10 text-yellow-700 dark:text-yellow-400 border-yellow-500/20" },
            suspended: { variant: "destructive" as const, className: "bg-red-500/10 text-red-700 dark:text-red-400 border-red-500/20" },
            in_dev: { variant: "outline" as const, className: "bg-blue-500/10 text-blue-700 dark:text-blue-400 border-blue-500/20" },
        }
        return variants[status as keyof typeof variants] || variants.active
    }

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('en-NG', {
            style: 'currency',
            currency: 'NGN',
        }).format(amount)
    }

    const formatDate = (date: string) => {
        return format(new Date(date), 'MMM dd, yyyy')
    }

    const formatDateTime = (date: string) => {
        return format(new Date(date), 'MMM dd, yyyy HH:mm')
    }

    return (
        <div className="space-y-6">
            <div className="flex items-start justify-between">
                <div className="space-y-1">
                    <Button
                        variant="ghost"
                        onClick={() => router.push("/admin/clients")}
                        className="mb-2 -ml-2"
                    >
                        <ArrowLeft className="h-4 w-4 mr-2" />
                        Back to Organizations
                    </Button>
                    <h1 className="text-3xl font-bold tracking-tight flex items-center gap-3">
                        {organization.name}
                    </h1>
                    <p className="text-muted-foreground">
                        Organization details, users, projects, and financial overview
                    </p>
                </div>
                <div className="flex gap-3">
                    <Button variant="outline" onClick={() => router.push(`/admin/clients/${organization.id}/edit`)}>
                        Edit Organization
                    </Button>
                    <Button onClick={() => router.push(`/admin/clients/${organization.id}/invite`)}>
                        <UserPlus className="h-4 w-4 mr-2" />
                        Invite User
                    </Button>
                </div>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Wallet Balance</CardTitle>
                        <Wallet className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{formatCurrency(wallet?.balance || 0)}</div>
                        <p className="text-xs text-muted-foreground mt-1">
                            Outstanding: {formatCurrency(wallet?.outstanding_balance || 0)}
                        </p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Spending</CardTitle>
                        <TrendingUp className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{formatCurrency(statistics.totalSpending)}</div>
                        <p className="text-xs text-muted-foreground mt-1">
                            All-time expenditure
                        </p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Projects</CardTitle>
                        <FolderKanban className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{statistics.totalProjects}</div>
                        <p className="text-xs text-muted-foreground mt-1">
                            {statistics.projectsByStatus.active || 0} active, {statistics.projectsByStatus.in_dev || 0} in dev
                        </p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Team Members</CardTitle>
                        <Users className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{statistics.totalUsers}</div>
                        <p className="text-xs text-muted-foreground mt-1">
                            {statistics.pendingInvitations} pending invitations
                        </p>
                    </CardContent>
                </Card>
            </div>

             <div className="grid gap-6 lg:grid-cols-2">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between">
                        <div>
                            <CardTitle>Recent Transactions</CardTitle>
                            <CardDescription>Latest wallet activity</CardDescription>
                        </div>
                        <Button variant="ghost" size="sm" onClick={() => router.push(`/admin/clients/${organization.id}/transactions`)}>
                            View All
                            <ArrowUpRight className="h-4 w-4 ml-1" />
                        </Button>
                    </CardHeader>
                    <CardContent>
                        {wallet && wallet.transactions.length > 0 ? (
                            <div className="space-y-3">
                                {wallet.transactions.slice(0, 5).map((transaction) => (
                                    <div key={transaction.id} className="flex items-center justify-between p-3 border rounded-lg hover:bg-accent/50 transition-colors">
                                        <div className="flex items-center gap-3">
                                            <div className={`p-2 rounded-full ${transaction.type === 'credit' ? 'bg-green-500/10' : 'bg-red-500/10'}`}>
                                                {transaction.type === 'credit' ? (
                                                    <ArrowDownRight className="h-4 w-4 text-green-600 dark:text-green-400" />
                                                ) : (
                                                    <ArrowUpRight className="h-4 w-4 text-red-600 dark:text-red-400" />
                                                )}
                                            </div>
                                            <div>
                                                <p className="text-sm font-medium line-clamp-1">{transaction.description}</p>
                                                <p className="text-xs text-muted-foreground">{formatDateTime(transaction.createdAt)}</p>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <p className={`text-sm font-semibold ${transaction.type === 'credit' ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                                                {transaction.type === 'credit' ? '+' : '-'}{formatCurrency(transaction.amount)}
                                            </p>
                                            <Badge 
                                                variant="outline" 
                                                className={`text-xs mt-1 ${getStatusBadge(transaction.status).className}`}
                                            >
                                                {transaction.status}
                                            </Badge>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-8 border border-dashed rounded-lg">
                                <Activity className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
                                <p className="text-sm text-muted-foreground">No transactions yet</p>
                            </div>
                        )}
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between">
                        <div>
                            <CardTitle>Projects</CardTitle>
                            <CardDescription>Organization's hosted projects</CardDescription>
                        </div>
                        <Button variant="ghost" size="sm" onClick={() => router.push(`/admin/clients/${organization.id}/projects`)}>
                            View All
                            <ArrowUpRight className="h-4 w-4 ml-1" />
                        </Button>
                    </CardHeader>
                    <CardContent>
                        {organization.projects.length > 0 ? (
                            <div className="space-y-3">
                                {organization.projects.slice(0, 5).map((project) => (
                                    <div 
                                        key={project.id} 
                                        className="flex items-center justify-between p-3 border rounded-lg hover:bg-accent/50 transition-colors cursor-pointer"
                                        onClick={() => router.push(`/admin/clients/${organizationId}/projects/${project.id}`)}
                                    >
                                        <div className="flex-1 min-w-0">
                                            <p className="text-sm font-medium line-clamp-1">{project.projectName}</p>
                                            <p className="text-xs text-muted-foreground line-clamp-1">{project.description}</p>
                                            <div className="flex items-center gap-2 mt-1">
                                                <Badge 
                                                    variant="outline" 
                                                    className={`text-xs ${getStatusBadge(project.status).className}`}
                                                >
                                                    {project.status}
                                                </Badge>
                                                <span className="text-xs text-muted-foreground">
                                                    {formatCurrency(project.monthly_billing)}/month
                                                </span>
                                            </div>
                                        </div>
                                        <ArrowUpRight className="h-4 w-4 text-muted-foreground ml-2" />
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-8 border border-dashed rounded-lg">
                                <FolderKanban className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
                                <p className="text-sm text-muted-foreground">No projects yet</p>
                                <Button variant="link" size="sm" className="mt-2" onClick={() => router.push("/admin/create")}>
                                    Create your first project
                                </Button>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>

            <div className="grid gap-6 lg:grid-cols-3">
                <Card className="lg:col-span-2">
                    <CardHeader className="flex flex-row items-center justify-between">
                        <div>
                            <CardTitle>Organization Owner & Members</CardTitle>
                            <CardDescription>Manage team access and permissions</CardDescription>
                        </div>
                        <Button variant="ghost" size="sm" onClick={() => router.push(`/admin/clients/${organization.id}/users`)}>
                            View All
                            <ArrowUpRight className="h-4 w-4 ml-1" />
                        </Button>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="p-4 border-2 border-primary/20 rounded-lg bg-primary/5">
                            <div className="flex items-center gap-4">
                                <Avatar className="h-12 w-12 ring-2 ring-primary shadow-sm">
                                    <AvatarImage src={undefined} />
                                    <AvatarFallback className="bg-primary text-primary-foreground font-semibold">
                                        {getInitials(organization.owner.name)}
                                    </AvatarFallback>
                                </Avatar>
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-2">
                                        <p className="text-sm font-semibold">{organization.owner.name}</p>
                                        <Badge variant="default" className="text-xs">Owner</Badge>
                                    </div>
                                    <p className="text-xs text-muted-foreground">{organization.owner.email}</p>
                                    <div className="flex items-center gap-2 mt-1">
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
                                    </div>
                                </div>
                            </div>
                        </div>

                        {organization.organizationUsers.length > 0 ? (
                            <div className="space-y-2">
                                <h3 className="text-sm font-semibold">Team Members ({organization.organizationUsers.length})</h3>
                                {organization.organizationUsers.map((orgUser) => (
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
                                                    className={`text-xs ${getStatusBadge(orgUser.status).className}`}
                                                >
                                                    {orgUser.status}
                                                </Badge>
                                                <Badge variant="outline" className="text-xs capitalize">
                                                    {orgUser.user.role}
                                                </Badge>
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
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-8 border border-dashed rounded-lg">
                                <Users className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
                                <p className="text-sm text-muted-foreground">No team members yet</p>
                                <Button variant="link" size="sm" className="mt-2" onClick={() => router.push(`/admin/clients/${organization.id}/invite`)}>
                                    Invite your first member
                                </Button>
                            </div>
                        )}

                        {organization.invitations && organization.invitations.length > 0 && (
                            <div className="space-y-2 pt-4 border-t">
                                <h3 className="text-sm font-semibold">Pending Invitations ({organization.invitations.length})</h3>
                                {organization.invitations.map((invitation) => (
                                    <div key={invitation.id} className="flex items-center gap-4 p-3 border border-dashed rounded-lg">
                                        <Mail className="h-5 w-5 text-muted-foreground" />
                                        <div className="flex-1 min-w-0">
                                            <p className="text-sm font-medium">{invitation.email}</p>
                                            <p className="text-xs text-muted-foreground">
                                                Invited by {invitation.invitedBy.name} • {formatDate(invitation.createdAt)}
                                            </p>
                                        </div>
                                        <Badge variant="outline" className="text-xs bg-yellow-500/10 text-yellow-700 dark:text-yellow-400 border-yellow-500/20">
                                            <Clock className="h-3 w-3 mr-1" />
                                            Pending
                                        </Badge>
                                    </div>
                                ))}
                            </div>
                        )}
                    </CardContent>
                </Card>

                <OrgWalletDetails wallet={wallet} organization={organization} />
            </div>

           

            <Card>
                <CardHeader>
                    <CardTitle>Organization Information</CardTitle>
                    <CardDescription>General details and metadata</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="grid gap-6 md:grid-cols-2">
                        <div className="space-y-4">
                            <div>
                                <p className="text-sm text-muted-foreground mb-1">Organization Name</p>
                                <p className="font-medium">{organization.name}</p>
                            </div>
                            <div>
                                <p className="text-sm text-muted-foreground mb-1">Slug</p>
                                <p className="font-mono text-sm">{organization.slug}</p>
                            </div>
                            <div>
                                <p className="text-sm text-muted-foreground mb-1">Owner</p>
                                <p className="font-medium">{organization.owner.name}</p>
                                <p className="text-sm text-muted-foreground">{organization.owner.email}</p>
                            </div>
                        </div>
                        <div className="space-y-4">
                            <div>
                                <p className="text-sm text-muted-foreground mb-1">Created</p>
                                <div className="flex items-center gap-2">
                                    <Calendar className="h-4 w-4 text-muted-foreground" />
                                    <p className="font-medium">{formatDate(organization.createdAt)}</p>
                                </div>
                            </div>
                            <div>
                                <p className="text-sm text-muted-foreground mb-1">Last Updated</p>
                                <div className="flex items-center gap-2">
                                    <Clock className="h-4 w-4 text-muted-foreground" />
                                    <p className="font-medium">{formatDate(organization.updatedAt)}</p>
                                </div>
                            </div>
                            <div>
                                <p className="text-sm text-muted-foreground mb-1">Organization ID</p>
                                <p className="font-mono text-xs">{organization.id}</p>
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
