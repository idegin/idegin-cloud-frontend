import { Card } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

export function OrganizationLoading() {
    return (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => (
                <Card key={i} className="overflow-hidden border-l-4 border-l-muted">
                    <div className="p-6 space-y-5">
                        <div className="flex items-start justify-between">
                            <div className="space-y-3 flex-1">
                                <Skeleton className="h-7 w-3/4" />
                                <Skeleton className="h-5 w-1/2" />
                            </div>
                            <Skeleton className="h-9 w-9 rounded-md" />
                        </div>

                        <div className="space-y-2">
                            <Skeleton className="h-4 w-full" />
                            <Skeleton className="h-4 w-5/6" />
                        </div>

                        <div className="flex items-center gap-3 pt-5 border-t">
                            <Skeleton className="h-10 w-10 rounded-full" />
                            <div className="flex flex-col gap-2 flex-1">
                                <Skeleton className="h-4 w-24" />
                                <Skeleton className="h-3 w-32" />
                            </div>
                        </div>

                        <div className="flex items-center gap-4 pt-3 border-t">
                            <div className="flex items-center gap-2">
                                <Skeleton className="h-4 w-4 rounded-full" />
                                <Skeleton className="h-4 w-20" />
                            </div>
                            <div className="flex items-center gap-2">
                                <Skeleton className="h-4 w-4 rounded-full" />
                                <Skeleton className="h-4 w-16" />
                            </div>
                        </div>
                    </div>
                </Card>
            ))}
        </div>
    )
}
