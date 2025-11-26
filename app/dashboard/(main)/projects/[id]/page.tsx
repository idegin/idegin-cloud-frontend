"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import {
    AlertCircle,
    Activity,
    Server,
    ArrowUpRight,
    Wallet,
    FileText,
    Calendar,
    ChevronLeft,
    ChevronRight,
    TrendingUp,
    HardDrive,
    Database,
    Folder,
} from "lucide-react";
import { ProjectDetailsLoading } from "./project-details-loading";
import ProjectActionBtn from "./components/project-action-btn";
import { useProjectDetails } from "@/lib/hooks/use-projects";

const getStatusConfig = (status: string) => {
    switch (status) {
        case "running":
            return {
                color: "bg-green-500/10 text-green-700 dark:text-green-400 border-green-500/20",
                icon: Activity,
                label: "Running",
            };
        case "stopped":
            return {
                color: "bg-gray-500/10 text-gray-700 dark:text-gray-400 border-gray-500/20",
                icon: Server,
                label: "Stopped",
            };
        case "deploying":
            return {
                color: "bg-blue-500/10 text-blue-700 dark:text-blue-400 border-blue-500/20",
                icon: ArrowUpRight,
                label: "Deploying",
            };
        case "error":
            return {
                color: "bg-destructive/10 text-destructive border-destructive/20",
                icon: Activity,
                label: "Error",
            };
        default:
            return {
                color: "bg-gray-500/10 text-gray-700 dark:text-gray-400 border-gray-500/20",
                icon: Server,
                label: status,
            };
    }
};

export default function ProjectDetailsPage({
    params,
}: {
    params: Promise<{ id: string }>;
}) {
    const router = useRouter();
    const [projectId, setProjectId] = useState<string | null>(null);
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 5;

    useEffect(() => {
        params.then(({ id }) => {
            setProjectId(id);
        });
    }, [params]);

    const { data, isLoading, error } = useProjectDetails(projectId || "");

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat("en-NG", {
            style: "currency",
            currency: "NGN",
            minimumFractionDigits: 2,
        }).format(amount);
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString("en-US", {
            year: "numeric",
            month: "short",
            day: "numeric",
        });
    };

    const isOverdue = (dueDate: string, status: string) => {
        if (status === "paid") return false;
        return new Date(dueDate) < new Date();
    };

    if (isLoading) {
        return <ProjectDetailsLoading />;
    }

    if (error) {
        return (
            <div className='space-y-6'>
                <Button
                    variant='ghost'
                    onClick={() => router.back()}
                    className='mb-4'
                >
                    <ChevronLeft className='h-4 w-4 mr-2' />
                    Back to Projects
                </Button>
                <Card className='p-12'>
                    <div className='text-center'>
                        <AlertCircle className='h-12 w-12 text-destructive mx-auto mb-4' />
                        <h3 className='font-semibold text-lg mb-2'>
                            Error loading project
                        </h3>
                        <p className='text-sm text-muted-foreground'>
                            {error instanceof Error ? error.message : 'Failed to load project details'}
                        </p>
                    </div>
                </Card>
            </div>
        );
    }

    if (!data) {
        return (
            <div className='space-y-6'>
                <Button
                    variant='ghost'
                    onClick={() => router.back()}
                    className='mb-4'
                >
                    <ChevronLeft className='h-4 w-4 mr-2' />
                    Back to Projects
                </Button>
                <Card className='p-12'>
                    <div className='text-center'>
                        <AlertCircle className='h-12 w-12 text-muted-foreground mx-auto mb-4' />
                        <h3 className='font-semibold text-lg mb-2'>
                            Project not found
                        </h3>
                        <p className='text-sm text-muted-foreground'>
                            The project you're looking for doesn't exist or has
                            been removed.
                        </p>
                    </div>
                </Card>
            </div>
        );
    }

    const { project, wallet, invoices, storage, cms } = data;
    const totalUnpaid = wallet?.outstanding_balance || 0;
    const totalPages = Math.ceil(invoices.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const currentInvoices = invoices.slice(startIndex, endIndex);

    const goToNextPage = () => {
        setCurrentPage((prev) => Math.min(prev + 1, totalPages));
    };

    const goToPreviousPage = () => {
        setCurrentPage((prev) => Math.max(prev - 1, 1));
    };

    const statusConfig = getStatusConfig(project.status);
    const StatusIcon = statusConfig.icon;
    const hasUnpaidInvoices = totalUnpaid > 0;

    const getLastUpdated = () => {
        const updatedAt = new Date(project.updatedAt);
        const now = new Date();
        const diffMs = now.getTime() - updatedAt.getTime();
        const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
        
        if (diffHours < 1) return "Less than an hour ago";
        if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
        const diffDays = Math.floor(diffHours / 24);
        return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
    };

    return (
        <div className='space-y-6'>
            <Button
                variant='ghost'
                onClick={() => router.back()}
                className='mb-4'
            >
                <ChevronLeft className='h-4 w-4 mr-2' />
                Back to Projects
            </Button>

            {hasUnpaidInvoices && (
                <Alert variant='destructive'>
                    <AlertCircle className='h-4 w-4' />
                    <AlertTitle>Unpaid Invoices</AlertTitle>
                    <AlertDescription className='flex items-center justify-between'>
                        <span>
                            You have {formatCurrency(totalUnpaid)} in
                            unpaid invoices. Please fund your wallet to continue
                            using this project.
                        </span>
                        <Button
                            variant='outline'
                            size='sm'
                            className='ml-4 bg-background hover:bg-accent'
                            onClick={() => router.push("/dashboard/wallet")}
                        >
                            <Wallet className='h-4 w-4 mr-2' />
                            Fund Wallet
                        </Button>
                    </AlertDescription>
                </Alert>
            )}

            <div>
                <div className='flex items-start justify-between mb-2'>
                    <div>
                        <h1 className='text-3xl font-bold tracking-tight'>
                            {project.projectName}
                        </h1>
                        <p className='text-muted-foreground mt-1'>
                            {project.description}
                        </p>
                    </div>
                    <Badge
                        variant='outline'
                        className={`${statusConfig.color} text-sm`}
                    >
                        <StatusIcon className='h-3 w-3 mr-1.5' />
                        {statusConfig.label}
                    </Badge>
                </div>
                <p className='text-xs text-muted-foreground'>
                    Last updated: {getLastUpdated()}
                </p>
            </div>

            <div className='grid gap-6 md:grid-cols-2'>
                <Card>
                    <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
                        <CardTitle className='text-sm font-medium'>
                            Storage Usage
                        </CardTitle>
                        <HardDrive className='h-4 w-4 text-muted-foreground' />
                    </CardHeader>
                    <CardContent>
                        {storage ? (
                            <>
                                <div className='text-2xl font-bold'>
                                    {storage.usedGB.toFixed(2)} GB
                                    <span className='text-lg text-muted-foreground font-normal'> / {storage.maxGB} GB</span>
                                </div>
                                <div className='mt-3 space-y-2'>
                                    <div className='w-full bg-muted rounded-full h-2'>
                                        <div 
                                            className={`h-2 rounded-full transition-all ${
                                                storage.percentageUsed > 90 
                                                    ? 'bg-destructive' 
                                                    : storage.percentageUsed > 75 
                                                    ? 'bg-amber-500' 
                                                    : 'bg-primary'
                                            }`}
                                            style={{ width: `${Math.min(storage.percentageUsed, 100)}%` }}
                                        />
                                    </div>
                                    <p className='text-xs text-muted-foreground'>
                                        {storage.percentageUsed.toFixed(1)}% used
                                    </p>
                                </div>
                                {storage.percentageUsed > 90 && (
                                    <div className='mt-3 flex items-center gap-2 text-xs text-destructive'>
                                        <AlertCircle className='h-3 w-3' />
                                        <span>Storage almost full</span>
                                    </div>
                                )}
                            </>
                        ) : (
                            <p className='text-sm text-muted-foreground'>Storage data unavailable</p>
                        )}
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
                        <CardTitle className='text-sm font-medium'>
                            CMS Content
                        </CardTitle>
                        <Database className='h-4 w-4 text-muted-foreground' />
                    </CardHeader>
                    <CardContent>
                        {cms ? (
                            <>
                                <div className='space-y-3'>
                                    <div className='flex items-center justify-between'>
                                        <div className='flex items-center gap-2'>
                                            <Folder className='h-4 w-4 text-muted-foreground' />
                                            <span className='text-sm text-muted-foreground'>Collections</span>
                                        </div>
                                        <span className='text-xl font-bold'>{cms.collectionsCount}</span>
                                    </div>
                                    <div className='flex items-center justify-between'>
                                        <div className='flex items-center gap-2'>
                                            <FileText className='h-4 w-4 text-muted-foreground' />
                                            <span className='text-sm text-muted-foreground'>Entries</span>
                                        </div>
                                        <span className='text-xl font-bold'>{cms.entriesCount}</span>
                                    </div>
                                </div>
                                <p className='text-xs text-muted-foreground mt-3'>
                                    Total content items in your CMS
                                </p>
                            </>
                        ) : (
                            <p className='text-sm text-muted-foreground'>CMS data unavailable</p>
                        )}
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
                        <CardTitle className='text-sm font-medium'>
                            Monthly Billing
                        </CardTitle>
                        <TrendingUp className='h-4 w-4 text-muted-foreground' />
                    </CardHeader>
                    <CardContent>
                        <div className='text-3xl font-bold'>
                            {formatCurrency(project.monthly_billing)}
                        </div>
                        <p className='text-xs text-muted-foreground mt-1'>
                            Recurring monthly charge for this project
                        </p>
                    </CardContent>
                </Card>

                <Card
                    className={hasUnpaidInvoices ? "border-destructive/50" : ""}
                >
                    <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
                        <CardTitle className='text-sm font-medium'>
                            Total Unpaid
                        </CardTitle>
                        {hasUnpaidInvoices ? (
                            <AlertCircle className='h-4 w-4 text-destructive' />
                        ) : (
                            <FileText className='h-4 w-4 text-muted-foreground' />
                        )}
                    </CardHeader>
                    <CardContent>
                        <div
                            className={`text-3xl font-bold ${
                                hasUnpaidInvoices ? "text-destructive" : ""
                            }`}
                        >
                            {formatCurrency(totalUnpaid)}
                        </div>
                        <p className='text-xs text-muted-foreground mt-1 mb-3'>
                            {hasUnpaidInvoices
                                ? "Outstanding invoices requiring payment"
                                : "All invoices are up to date"}
                        </p>
                        {hasUnpaidInvoices && (
                            <Button
                                className='w-full'
                                variant='destructive'
                                onClick={() => router.push("/dashboard/wallet")}
                            >
                                Pay Now
                            </Button>
                        )}
                    </CardContent>
                </Card>
            </div>


           {process.env.NODE_ENV !== "production" && (<div>
                <ProjectActionBtn 
                    integrationSettings={{
                        enableCms: project.enableCms ?? true,
                        enableEmailMarketing: project.enableEmailMarketing ?? true,
                        enableCrm: project.enableCrm ?? true,
                    }}
                />
            </div>)}

            <Card className='border-none p-0 px-0'>
                <CardHeader className='p-0'>
                    <CardTitle>Transaction History</CardTitle>
                    <CardDescription>
                        View and manage all transactions for this project
                    </CardDescription>
                </CardHeader>
                <CardContent className='p-0'>
                    {invoices.length === 0 ? (
                        <div className='text-center py-12'>
                            <FileText className='h-12 w-12 text-muted-foreground mx-auto mb-4' />
                            <h3 className='font-semibold text-lg mb-2'>
                                No transactions yet
                            </h3>
                            <p className='text-sm text-muted-foreground'>
                                Transaction history for this project will appear
                                here
                            </p>
                        </div>
                    ) : (
                        <div className='space-y-4'>
                            <div className='rounded-md border'>
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>Reference</TableHead>
                                            <TableHead>Status</TableHead>
                                            <TableHead>Due Date</TableHead>
                                            <TableHead className='text-right'>
                                                Amount
                                            </TableHead>
                                            <TableHead className='text-right'>
                                                Action
                                            </TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {currentInvoices.map((invoice) => {
                                            const overdue = isOverdue(
                                                invoice.dueDate,
                                                invoice.status
                                            );
                                            return (
                                                <TableRow key={invoice.id}>
                                                    <TableCell className='font-medium hover:underline cursor-pointer hover:text-primary'>
                                                        {invoice.reference}
                                                    </TableCell>
                                                    <TableCell>
                                                        <div className='flex items-center gap-2'>
                                                            <Badge
                                                                variant={
                                                                    invoice.status ===
                                                                    "paid"
                                                                        ? "default"
                                                                        : "destructive"
                                                                }
                                                                className={
                                                                    invoice.status ===
                                                                    "paid"
                                                                        ? "bg-green-500/10 text-green-700 dark:text-green-400 hover:bg-green-500/20 border-green-500/20"
                                                                        : ""
                                                                }
                                                            >
                                                                {invoice.status}
                                                            </Badge>
                                                            {overdue && (
                                                                <Badge
                                                                    variant='destructive'
                                                                    className='text-xs'
                                                                >
                                                                    Overdue
                                                                </Badge>
                                                            )}
                                                        </div>
                                                    </TableCell>
                                                    <TableCell>
                                                        <div className='flex items-center gap-2 text-sm'>
                                                            <Calendar className='h-3 w-3 text-muted-foreground' />
                                                            {formatDate(
                                                                invoice.dueDate
                                                            )}
                                                        </div>
                                                    </TableCell>
                                                    <TableCell className='text-right font-semibold'>
                                                        {formatCurrency(
                                                            invoice.amount
                                                        )}
                                                    </TableCell>
                                                    <TableCell className='text-right'>
                                                        {invoice.status ===
                                                        "unpaid" ? (
                                                            <Button
                                                                size='sm'
                                                                variant={
                                                                    overdue
                                                                        ? "destructive"
                                                                        : "outline"
                                                                }
                                                                onClick={() =>
                                                                    router.push(
                                                                        "/dashboard/wallet"
                                                                    )
                                                                }
                                                            >
                                                                Pay Now
                                                            </Button>
                                                        ) : (
                                                            <span className='text-xs text-muted-foreground'>
                                                                Paid on{" "}
                                                                {formatDate(
                                                                    invoice.createdAt
                                                                )}
                                                            </span>
                                                        )}
                                                    </TableCell>
                                                </TableRow>
                                            );
                                        })}
                                    </TableBody>
                                </Table>
                            </div>

                            {totalPages > 1 && (
                                <div className='flex items-center justify-between'>
                                    <p className='text-sm text-muted-foreground'>
                                        Showing {startIndex + 1} to{" "}
                                        {Math.min(endIndex, invoices.length)} of{" "}
                                        {invoices.length} invoices
                                    </p>
                                    <div className='flex items-center gap-2'>
                                        <Button
                                            variant='outline'
                                            size='sm'
                                            onClick={goToPreviousPage}
                                            disabled={currentPage === 1}
                                        >
                                            <ChevronLeft className='h-4 w-4 mr-1' />
                                            Previous
                                        </Button>
                                        <div className='flex items-center gap-1'>
                                            {Array.from(
                                                { length: totalPages },
                                                (_, i) => i + 1
                                            ).map((page) => (
                                                <Button
                                                    key={page}
                                                    variant={
                                                        currentPage === page
                                                            ? "default"
                                                            : "outline"
                                                    }
                                                    size='sm'
                                                    onClick={() =>
                                                        setCurrentPage(page)
                                                    }
                                                    className='w-8 h-8 p-0'
                                                >
                                                    {page}
                                                </Button>
                                            ))}
                                        </div>
                                        <Button
                                            variant='outline'
                                            size='sm'
                                            onClick={goToNextPage}
                                            disabled={
                                                currentPage === totalPages
                                            }
                                        >
                                            Next
                                            <ChevronRight className='h-4 w-4 ml-1' />
                                        </Button>
                                    </div>
                                </div>
                            )}
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
