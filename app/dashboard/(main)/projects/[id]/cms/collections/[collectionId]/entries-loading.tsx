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

export function CollectionEntriesLoading() {
    return (
        <div className="space-y-6">
            <div className="space-y-2">
                <Skeleton className="h-4 w-[400px]" />
            </div>

            <div className="flex items-center justify-between">
                <div className="space-y-2">
                    <Skeleton className="h-9 w-[250px]" />
                    <Skeleton className="h-4 w-[350px]" />
                </div>
                <Skeleton className="h-10 w-[120px]" />
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
                                    <TableHead>
                                        <Skeleton className="h-4 w-[80px]" />
                                    </TableHead>
                                    <TableHead>
                                        <Skeleton className="h-4 w-[80px]" />
                                    </TableHead>
                                    <TableHead>
                                        <Skeleton className="h-4 w-[100px]" />
                                    </TableHead>
                                    <TableHead>
                                        <Skeleton className="h-4 w-[100px]" />
                                    </TableHead>
                                    <TableHead className="w-[80px]">
                                        <Skeleton className="h-4 w-[60px]" />
                                    </TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {[...Array(8)].map((_, index) => (
                                    <TableRow key={index}>
                                        <TableCell>
                                            <Skeleton className="h-4 w-[200px]" />
                                        </TableCell>
                                        <TableCell>
                                            <Skeleton className="h-5 w-[100px] rounded-full" />
                                        </TableCell>
                                        <TableCell>
                                            <Skeleton className="h-4 w-[120px]" />
                                        </TableCell>
                                        <TableCell>
                                            <Skeleton className="h-4 w-[120px]" />
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
