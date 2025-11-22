import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbList,
    BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"

export function CMSCollectionsLoading() {
    return (
        <div className="space-y-6">
            {/* Bulk Actions Skeleton */}
            <div className="h-12" /> {/* Space for bulk actions */}

            {/* Breadcrumb Skeleton */}
            <Breadcrumb>
                <BreadcrumbList>
                    <BreadcrumbItem>
                        <Skeleton className="h-4 w-12" />
                    </BreadcrumbItem>
                    <BreadcrumbSeparator />
                    <BreadcrumbItem>
                        <Skeleton className="h-4 w-20" />
                    </BreadcrumbItem>
                    <BreadcrumbSeparator />
                    <BreadcrumbItem>
                        <Skeleton className="h-4 w-24" />
                    </BreadcrumbItem>
                    <BreadcrumbSeparator />
                    <BreadcrumbItem>
                        <Skeleton className="h-4 w-8" />
                    </BreadcrumbItem>
                </BreadcrumbList>
            </Breadcrumb>

            {/* Header Skeleton */}
            <div className="flex items-center justify-between">
                <div className="space-y-2">
                    <Skeleton className="h-9 w-[320px]" />
                    <Skeleton className="h-4 w-[480px]" />
                </div>
                <Skeleton className="h-9 w-[100px]" />
            </div>

            {/* Collections Table Skeleton */}
            <Card>
                <CardHeader className="border-b">
                    <div className="flex items-center justify-between">
                        <Skeleton className="h-6 w-[100px]" />
                        <div className="relative w-64">
                            <Skeleton className="h-9 w-full" />
                        </div>
                    </div>
                </CardHeader>
                <CardContent className="p-0">
                    <div className="rounded-md border-0">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead className="w-[50px]">
                                        <Skeleton className="h-4 w-4" />
                                    </TableHead>
                                    <TableHead>
                                        <Skeleton className="h-4 w-16" />
                                    </TableHead>
                                    <TableHead>
                                        <Skeleton className="h-4 w-12" />
                                    </TableHead>
                                    <TableHead>
                                        <Skeleton className="h-4 w-20" />
                                    </TableHead>
                                    <TableHead>
                                        <Skeleton className="h-4 w-20" />
                                    </TableHead>
                                    <TableHead>
                                        <Skeleton className="h-4 w-16" />
                                    </TableHead>
                                    <TableHead>
                                        <Skeleton className="h-4 w-16" />
                                    </TableHead>
                                    <TableHead className="w-[80px]">
                                        <Skeleton className="h-4 w-16" />
                                    </TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {[...Array(5)].map((_, index) => (
                                    <TableRow key={index}>
                                        <TableCell>
                                            <Skeleton className="h-4 w-4" />
                                        </TableCell>
                                        <TableCell>
                                            <div className="space-y-1">
                                                <Skeleton className="h-4 w-[140px]" />
                                                <Skeleton className="h-3 w-[100px]" />
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <Skeleton className="h-5 w-[80px] rounded-full" />
                                        </TableCell>
                                        <TableCell className="max-w-xs">
                                            <Skeleton className="h-4 w-[200px]" />
                                        </TableCell>
                                        <TableCell>
                                            <Skeleton className="h-8 w-8 rounded-full" />
                                        </TableCell>
                                        <TableCell>
                                            <Skeleton className="h-4 w-[80px]" />
                                        </TableCell>
                                        <TableCell>
                                            <Skeleton className="h-4 w-[80px]" />
                                        </TableCell>
                                        <TableCell>
                                            <Skeleton className="h-8 w-8 rounded-md" />
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
