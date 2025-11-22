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

export function WalletLoading() {
    return (
        <div className="space-y-12">
            <div>
                <Skeleton className="h-9 w-48 mb-2" />
                <Skeleton className="h-4 w-96" />
            </div>

            <div className="grid gap-6 md:grid-cols-2">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <Skeleton className="h-4 w-32" />
                        <Skeleton className="h-4 w-4 rounded-full" />
                    </CardHeader>
                    <CardContent>
                        <Skeleton className="h-10 w-40 mb-2" />
                        <Skeleton className="h-3 w-56" />
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <Skeleton className="h-4 w-32" />
                        <Skeleton className="h-4 w-4 rounded-full" />
                    </CardHeader>
                    <CardContent>
                        <Skeleton className="h-10 w-40 mb-2" />
                        <Skeleton className="h-3 w-56 mb-3" />
                        <Skeleton className="h-9 w-full" />
                    </CardContent>
                </Card>
            </div>

            <Card className="border-none p-0 px-0">
                <CardHeader className="p-0">
                    <Skeleton className="h-6 w-48 mb-2" />
                    <Skeleton className="h-4 w-64" />
                </CardHeader>
                <CardContent className="p-0">
                    <div className="space-y-4">
                        <div className="rounded-md border">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>
                                            <Skeleton className="h-4 w-20" />
                                        </TableHead>
                                        <TableHead>
                                            <Skeleton className="h-4 w-16" />
                                        </TableHead>
                                        <TableHead>
                                            <Skeleton className="h-4 w-14" />
                                        </TableHead>
                                        <TableHead>
                                            <Skeleton className="h-4 w-20" />
                                        </TableHead>
                                        <TableHead className="text-right">
                                            <Skeleton className="h-4 w-16 ml-auto" />
                                        </TableHead>
                                        <TableHead className="text-right">
                                            <Skeleton className="h-4 w-14 ml-auto" />
                                        </TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {[1, 2, 3, 4, 5].map((i) => (
                                        <TableRow key={i}>
                                            <TableCell>
                                                <Skeleton className="h-4 w-24" />
                                            </TableCell>
                                            <TableCell>
                                                <div className="flex items-center gap-2">
                                                    <Skeleton className="h-4 w-4" />
                                                    <Skeleton className="h-4 w-32" />
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <div className="flex items-center gap-2">
                                                    <Skeleton className="h-5 w-16 rounded-full" />
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <div className="flex items-center gap-2">
                                                    <Skeleton className="h-3 w-3" />
                                                    <Skeleton className="h-4 w-24" />
                                                </div>
                                            </TableCell>
                                            <TableCell className="text-right">
                                                <Skeleton className="h-4 w-24 ml-auto" />
                                            </TableCell>
                                            <TableCell className="text-right">
                                                <Skeleton className="h-8 w-20 ml-auto" />
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </div>

                        <div className="flex items-center justify-between">
                            <Skeleton className="h-4 w-48" />
                            <div className="flex items-center gap-2">
                                <Skeleton className="h-8 w-24" />
                                <div className="flex items-center gap-1">
                                    <Skeleton className="h-8 w-8" />
                                </div>
                                <Skeleton className="h-8 w-20" />
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
