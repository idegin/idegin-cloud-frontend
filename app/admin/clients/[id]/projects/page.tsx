"use client"

import { useState, useMemo } from "react"
import { useParams } from "next/navigation";
import { useRouter } from "next13-progressbar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { SectionPlaceholder } from "@/components/shared/section-placeholder"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import {
    ArrowLeft,
    Search,
    FolderKanban,
    ArrowUpRight,
    DollarSign,
    Activity,
    CheckCircle2,
    AlertCircle,
    Clock,
    AlertTriangle
} from "lucide-react"
import { useOrganizationProjects } from "@/lib/hooks/use-organizations"
import ProjectsLoading from "./loading"

export default function OrganizationProjectsPage() {
    const params = useParams()
    const router = useRouter()
    const organizationId = params.id as string

    const { data, isLoading, error, refetch } = useOrganizationProjects(organizationId)
    const [searchQuery, setSearchQuery] = useState("")
    const [statusFilter, setStatusFilter] = useState<string>("all")
    const [paymentFilter, setPaymentFilter] = useState<string>("all")

    const projects = data?.projects || []
    const organization = data?.organization

    const filteredProjects = useMemo(() => {
        return projects.filter(project => {
            const matchesSearch = project.projectName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                project.description.toLowerCase().includes(searchQuery.toLowerCase())
            const matchesStatus = statusFilter === "all" || project.status === statusFilter
            const matchesPayment = paymentFilter === "all" || 
                (paymentFilter === "active" && project.is_payment_active) ||
                (paymentFilter === "inactive" && !project.is_payment_active)

            return matchesSearch && matchesStatus && matchesPayment
        })
    }, [projects, searchQuery, statusFilter, paymentFilter])

    const stats = useMemo(() => ({
        total: projects.length,
        active: projects.filter(p => p.status === "active").length,
        inDev: projects.filter(p => p.status === "in_dev").length,
        suspended: projects.filter(p => p.status === "suspended").length,
        totalBilling: projects.reduce((sum, p) => sum + p.monthly_billing, 0),
    }), [projects])

    const getStatusBadge = (status: string) => {
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

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('en-NG', {
            style: 'currency',
            currency: 'NGN',
            minimumFractionDigits: 0,
        }).format(amount)
    }

    const formatDate = (date: string) => {
        return new Date(date).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        })
    }

    if (isLoading) {
        return <ProjectsLoading />
    }

    if (error) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <SectionPlaceholder
                    variant="error"
                    icon={AlertTriangle}
                    title="Failed to load projects"
                    description="There was an error loading the organization projects. Please try again."
                    action={{
                        label: "Retry",
                        onClick: () => refetch(),
                        variant: "default"
                    }}
                />
            </div>
        )
    }

    if (!data || !organization) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <SectionPlaceholder
                    variant="default"
                    icon={FolderKanban}
                    title="Organization not found"
                    description="The organization you're looking for doesn't exist."
                    action={{
                        label: "Go back",
                        onClick: () => router.push("/admin/clients"),
                        variant: "outline"
                    }}
                />
            </div>
        )
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
                        {organization.name} - Projects
                    </h1>
                    <p className="text-muted-foreground">
                        Manage and monitor all projects under this organization
                    </p>
                </div>
                <Button onClick={() => router.push("/admin/create")}>
                    Create New Project
                </Button>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Projects</CardTitle>
                        <FolderKanban className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats.total}</div>
                        <p className="text-xs text-muted-foreground mt-1">
                            {stats.active} active, {stats.inDev} in dev
                        </p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Active Projects</CardTitle>
                        <CheckCircle2 className="h-4 w-4 text-green-600" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats.active}</div>
                        <p className="text-xs text-muted-foreground mt-1">
                            Running production
                        </p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">In Development</CardTitle>
                        <Clock className="h-4 w-4 text-blue-600" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats.inDev}</div>
                        <p className="text-xs text-muted-foreground mt-1">
                            Under development
                        </p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Billing</CardTitle>
                        <DollarSign className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{formatCurrency(stats.totalBilling)}</div>
                        <p className="text-xs text-muted-foreground mt-1">
                            Monthly cost
                        </p>
                    </CardContent>
                </Card>
            </div>

            <Card>
                <CardHeader>
                    <div className="flex items-center justify-between">
                        <div>
                            <CardTitle>All Projects</CardTitle>
                            <CardDescription>
                                {filteredProjects.length} project{filteredProjects.length !== 1 ? 's' : ''} found
                            </CardDescription>
                        </div>
                    </div>
                    <div className="flex flex-col sm:flex-row gap-4 mt-4">
                        <div className="relative flex-1">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <Input
                                placeholder="Search projects..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="pl-9"
                            />
                        </div>
                        <Select value={statusFilter} onValueChange={setStatusFilter}>
                            <SelectTrigger className="w-full sm:w-[180px]">
                                <SelectValue placeholder="Status" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All Status</SelectItem>
                                <SelectItem value="active">Active</SelectItem>
                                <SelectItem value="in_dev">In Development</SelectItem>
                                <SelectItem value="suspended">Suspended</SelectItem>
                            </SelectContent>
                        </Select>
                        <Select value={paymentFilter} onValueChange={setPaymentFilter}>
                            <SelectTrigger className="w-full sm:w-[180px]">
                                <SelectValue placeholder="Payment" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All Payments</SelectItem>
                                <SelectItem value="active">Payment Active</SelectItem>
                                <SelectItem value="inactive">Payment Inactive</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </CardHeader>
                <CardContent>
                    {filteredProjects.length > 0 ? (
                        <div className="space-y-4">
                            {filteredProjects.map((project) => {
                                const statusConfig = getStatusBadge(project.status)
                                const StatusIcon = statusConfig.icon
                                
                                return (
                                    <div
                                        key={project.id}
                                        className="flex items-center justify-between p-4 border rounded-lg hover:bg-accent/50 transition-colors cursor-pointer"
                                        onClick={() => router.push(`/admin/clients/${organizationId}/projects/${project.id}`)}
                                    >
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center gap-3 mb-2">
                                                <h3 className="text-base font-semibold">{project.projectName}</h3>
                                                <Badge variant="outline" className={statusConfig.className}>
                                                    <StatusIcon className="h-3 w-3 mr-1" />
                                                    {statusConfig.label}
                                                </Badge>
                                            </div>
                                            <p className="text-sm text-muted-foreground line-clamp-2 mb-2">
                                                {project.description}
                                            </p>
                                            <div className="flex items-center gap-4 text-xs text-muted-foreground">
                                                <span className="flex items-center gap-1">
                                                    <DollarSign className="h-3 w-3" />
                                                    {formatCurrency(project.monthly_billing)}/month
                                                </span>
                                                <span>Created {formatDate(project.createdAt)}</span>
                                                <Badge 
                                                    variant="outline" 
                                                    className={`text-xs ${project.is_payment_active ? 'bg-green-500/10 text-green-700 border-green-500/20' : 'bg-red-500/10 text-red-700 border-red-500/20'}`}
                                                >
                                                    {project.is_payment_active ? 'Payment Active' : 'Payment Inactive'}
                                                </Badge>
                                            </div>
                                        </div>
                                        <ArrowUpRight className="h-5 w-5 text-muted-foreground ml-4 flex-shrink-0" />
                                    </div>
                                )
                            })}
                        </div>
                    ) : (
                        <div className="text-center py-12 border border-dashed rounded-lg">
                            <FolderKanban className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                            <h3 className="text-lg font-semibold mb-2">No projects found</h3>
                            <p className="text-sm text-muted-foreground mb-4">
                                {searchQuery || statusFilter !== "all" || paymentFilter !== "all"
                                    ? "Try adjusting your search filters"
                                    : "This organization doesn't have any projects yet"}
                            </p>
                            {!searchQuery && statusFilter === "all" && paymentFilter === "all" && (
                                <Button onClick={() => router.push("/admin/create")}>
                                    Create First Project
                                </Button>
                            )}
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    )
}
