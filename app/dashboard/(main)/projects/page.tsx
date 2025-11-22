"use client";

import { useState, useMemo } from "react";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import {
    Server,
    Activity,
    ArrowRight,
    Folder,
    Search,
    AlertCircle,
    Loader2,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useOrgProjects, useProjects } from "@/lib/hooks/use-projects";
import { SectionPlaceholder } from "@/components/shared/section-placeholder";
import { useApp } from "@/lib/contexts/app-context";

export default function ClientProjectsPage() {
    const router = useRouter();
    const { currentOrgUser } = useApp();
    const [searchQuery, setSearchQuery] = useState("");
    const [statusFilter, setStatusFilter] = useState<string>("all");
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 9;

    const { data, isLoading, error, refetch } = useProjects({
        status:
            statusFilter === "all"
                ? undefined
                : (statusFilter as "active" | "in_dev" | "suspended"),
        search: searchQuery.trim() || undefined,
        page: currentPage,
        limit: itemsPerPage,
    });

    const projects = data?.data?.items || [];
    const pagination = data?.data?.pagination;

    const getStatusConfig = (status: string) => {
        switch (status) {
            case "active":
                return {
                    color: "bg-green-500/10 text-green-700 dark:text-green-400 border-green-500/20",
                    icon: Activity,
                    label: "Active",
                };
            case "in_dev":
                return {
                    color: "bg-blue-500/10 text-blue-700 dark:text-blue-400 border-blue-500/20",
                    icon: ArrowRight,
                    label: "In Development",
                };
            case "suspended":
                return {
                    color: "bg-gray-500/10 text-gray-700 dark:text-gray-400 border-gray-500/20",
                    icon: Server,
                    label: "Suspended",
                };
            default:
                return {
                    color: "bg-gray-500/10 text-gray-700 dark:text-gray-400 border-gray-500/20",
                    icon: Server,
                    label: status,
                };
        }
    };

    const handlePageChange = (newPage: number) => {
        if (pagination && newPage >= 1 && newPage <= pagination.pages) {
            setCurrentPage(newPage);
            window.scrollTo({ top: 0, behavior: "smooth" });
        }
    };

    if (isLoading) {
        return (
            <div className='space-y-6'>
                <div>
                    <h1 className='text-3xl font-bold tracking-tight'>
                        Projects
                    </h1>
                    <p className='text-muted-foreground mt-1'>
                        View and manage all your hosted projects
                    </p>
                </div>
                <div className='flex items-center justify-center py-20'>
                    <div className='text-center'>
                        <Loader2 className='h-8 w-8 animate-spin mx-auto mb-4 text-primary' />
                        <p className='text-sm text-muted-foreground'>
                            Loading projects...
                        </p>
                    </div>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className='space-y-6'>
                <div>
                    <h1 className='text-3xl font-bold tracking-tight'>
                        Projects
                    </h1>
                    <p className='text-muted-foreground mt-1'>
                        View and manage all your hosted projects
                    </p>
                </div>
                <SectionPlaceholder
                    variant='error'
                    title='Failed to load projects'
                    description={
                        error instanceof Error
                            ? error.message
                            : "An unexpected error occurred"
                    }
                    action={{
                        label: "Try Again",
                        onClick: () => refetch(),
                    }}
                />
            </div>
        );
    }

    return (
        <div className='space-y-6'>
            {/* Header */}
            <div>
                <h1 className='text-3xl font-bold tracking-tight'>Projects</h1>
                <p className='text-muted-foreground mt-1'>
                    View and manage all your hosted projects
                </p>
            </div>

            {/* Filters */}
            <div className='flex flex-col sm:flex-row gap-4'>
                <div className='relative flex-1'>
                    <Search className='absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground' />
                    <Input
                        placeholder='Search projects...'
                        value={searchQuery}
                        onChange={(e) => {
                            setSearchQuery(e.target.value);
                            setCurrentPage(1);
                        }}
                        className='pl-9'
                    />
                </div>
                <Select
                    value={statusFilter}
                    onValueChange={(value) => {
                        setStatusFilter(value);
                        setCurrentPage(1);
                    }}
                >
                    <SelectTrigger className='w-full sm:w-[180px]'>
                        <SelectValue placeholder='Filter by status' />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value='all'>All Status</SelectItem>
                        <SelectItem value='active'>Active</SelectItem>
                        <SelectItem value='in_dev'>In Development</SelectItem>
                        <SelectItem value='suspended'>Suspended</SelectItem>
                    </SelectContent>
                </Select>
            </div>

            {/* Projects Grid */}
            {projects.length === 0 ? (
                <SectionPlaceholder
                    variant='default'
                    icon={Folder}
                    title={
                        searchQuery || statusFilter !== "all"
                            ? "No projects found"
                            : "No projects yet"
                    }
                    description={
                        searchQuery || statusFilter !== "all"
                            ? "Try adjusting your search or filter criteria"
                            : "You don't have any projects deployed yet. Contact your administrator to get started."
                    }
                    action={
                        searchQuery || statusFilter !== "all"
                            ? {
                                  label: "Clear Filters",
                                  onClick: () => {
                                      setSearchQuery("");
                                      setStatusFilter("all");
                                      setCurrentPage(1);
                                  },
                              }
                            : undefined
                    }
                />
            ) : (
                <>
                    <div className='grid gap-4 md:grid-cols-2 lg:grid-cols-3'>
                        {projects.map((project) => {
                            const statusConfig = getStatusConfig(
                                project.status
                            );
                            const StatusIcon = statusConfig.icon;

                            return (
                                <Card
                                    key={project.id}
                                    className='overflow-hidden hover:shadow-md transition-shadow cursor-pointer group'
                                    onClick={() =>
                                        router.push(
                                            `/dashboard/projects/${project.id}`
                                        )
                                    }
                                >
                                    <CardHeader className='pb-3'>
                                        <div className='flex items-start justify-between gap-2'>
                                            <div className='flex-1 space-y-1'>
                                                <CardTitle className='text-lg line-clamp-1 group-hover:text-primary transition-colors'>
                                                    {project.projectName}
                                                </CardTitle>
                                                <div className='flex items-center gap-2'>
                                                    <Badge
                                                        variant='outline'
                                                        className={`${statusConfig.color} text-xs`}
                                                    >
                                                        <StatusIcon className='h-3 w-3 mr-1' />
                                                        {statusConfig.label}
                                                    </Badge>
                                                </div>
                                            </div>
                                            <Button
                                                variant='ghost'
                                                size='icon'
                                                className='h-8 w-8'
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    router.push(
                                                        `/dashboard/projects/${project.id}`
                                                    );
                                                }}
                                            >
                                                <ArrowRight className='h-4 w-4' />
                                            </Button>
                                        </div>
                                    </CardHeader>
                                    <CardContent className='pb-4'>
                                        <div className='space-y-3'>
                                            <p className='text-sm text-muted-foreground line-clamp-2'>
                                                {project.description}
                                            </p>
                                            <div className='pt-2 border-t'>
                                                <div className='flex items-center justify-between'>
                                                    <div>
                                                        <p className='text-xs text-muted-foreground'>
                                                            Monthly Billing
                                                        </p>
                                                        <p className='text-sm font-medium'>
                                                            $
                                                            {project.monthly_billing.toFixed(
                                                                2
                                                            )}
                                                        </p>
                                                    </div>
                                                    <div className='text-right'>
                                                        <p className='text-xs text-muted-foreground'>
                                                            Payment
                                                        </p>
                                                        <Badge
                                                            variant={
                                                                project.is_payment_active
                                                                    ? "default"
                                                                    : "secondary"
                                                            }
                                                            className='text-xs'
                                                        >
                                                            {project.is_payment_active
                                                                ? "Active"
                                                                : "Inactive"}
                                                        </Badge>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            );
                        })}
                    </div>

                    {/* Pagination */}
                    {pagination && pagination.pages > 1 && (
                        <div className='flex items-center justify-between pt-4'>
                            <p className='text-sm text-muted-foreground'>
                                Showing{" "}
                                {(pagination.page - 1) * pagination.limit + 1}{" "}
                                to{" "}
                                {Math.min(
                                    pagination.page * pagination.limit,
                                    pagination.total
                                )}{" "}
                                of {pagination.total} projects
                            </p>
                            <div className='flex gap-2'>
                                <Button
                                    variant='outline'
                                    size='sm'
                                    onClick={() =>
                                        handlePageChange(currentPage - 1)
                                    }
                                    disabled={!pagination.hasPrev}
                                >
                                    Previous
                                </Button>
                                <div className='flex items-center gap-1'>
                                    {Array.from(
                                        {
                                            length: Math.min(
                                                5,
                                                pagination.pages
                                            ),
                                        },
                                        (_, i) => {
                                            let pageNum: number;
                                            if (pagination.pages <= 5) {
                                                pageNum = i + 1;
                                            } else if (currentPage <= 3) {
                                                pageNum = i + 1;
                                            } else if (
                                                currentPage >=
                                                pagination.pages - 2
                                            ) {
                                                pageNum =
                                                    pagination.pages - 4 + i;
                                            } else {
                                                pageNum = currentPage - 2 + i;
                                            }

                                            return (
                                                <Button
                                                    key={pageNum}
                                                    variant={
                                                        currentPage === pageNum
                                                            ? "default"
                                                            : "outline"
                                                    }
                                                    size='sm'
                                                    onClick={() =>
                                                        handlePageChange(
                                                            pageNum
                                                        )
                                                    }
                                                >
                                                    {pageNum}
                                                </Button>
                                            );
                                        }
                                    )}
                                </div>
                                <Button
                                    variant='outline'
                                    size='sm'
                                    onClick={() =>
                                        handlePageChange(currentPage + 1)
                                    }
                                    disabled={!pagination.hasNext}
                                >
                                    Next
                                </Button>
                            </div>
                        </div>
                    )}
                </>
            )}
        </div>
    );
}
