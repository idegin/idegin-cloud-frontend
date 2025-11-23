import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"

export function EmailListLoading() {
    return (
        <div className="space-y-6">
            <div className="h-12" />

            <div className="flex items-center justify-between">
                <div className="space-y-2">
                    <Skeleton className="h-9 w-[250px]" />
                    <Skeleton className="h-4 w-[350px]" />
                </div>
                <div className="flex items-center gap-2">
                    <Skeleton className="h-9 w-[100px]" />
                    <Skeleton className="h-9 w-[140px]" />
                </div>
            </div>

            <Card>
                <CardHeader className="border-b">
                    <div className="flex items-center justify-between">
                        <Skeleton className="h-6 w-[120px]" />
                        <Skeleton className="h-9 w-[250px]" />
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
                                    <TableHead className="min-w-[200px]">
                                        <Skeleton className="h-4 w-16" />
                                    </TableHead>
                                    <TableHead className="min-w-[250px]">
                                        <Skeleton className="h-4 w-16" />
                                    </TableHead>
                                    <TableHead className="w-[100px]">
                                        <Skeleton className="h-4 w-16" />
                                    </TableHead>
                                    <TableHead className="w-[150px]">
                                        <Skeleton className="h-4 w-16" />
                                    </TableHead>
                                    <TableHead className="min-w-[150px]">
                                        <Skeleton className="h-4 w-20" />
                                    </TableHead>
                                    <TableHead className="w-[80px]">
                                        <Skeleton className="h-4 w-16" />
                                    </TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {[...Array(8)].map((_, index) => (
                                    <TableRow key={index}>
                                        <TableCell>
                                            <Skeleton className="h-4 w-4" />
                                        </TableCell>
                                        <TableCell>
                                            <Skeleton className="h-4 w-[150px]" />
                                        </TableCell>
                                        <TableCell>
                                            <Skeleton className="h-4 w-[200px]" />
                                        </TableCell>
                                        <TableCell>
                                            <Skeleton className="h-5 w-[70px] rounded-full" />
                                        </TableCell>
                                        <TableCell>
                                            <Skeleton className="h-5 w-[90px] rounded-full" />
                                        </TableCell>
                                        <TableCell>
                                            <Skeleton className="h-4 w-[100px]" />
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
