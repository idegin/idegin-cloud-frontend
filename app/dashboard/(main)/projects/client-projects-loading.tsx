import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

export function ClientProjectsLoading() {
    return (
        <div className="space-y-6">
            {/* Header */}
            <div>
                <Skeleton className="h-9 w-48 mb-2" />
                <Skeleton className="h-4 w-96" />
            </div>

            {/* Project Cards Grid */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                    <Card key={i} className="overflow-hidden">
                        <CardHeader className="pb-3">
                            <div className="flex items-start justify-between gap-2">
                                <div className="flex-1 space-y-2">
                                    <Skeleton className="h-6 w-3/4" />
                                    <div className="flex items-center gap-2">
                                        <Skeleton className="h-5 w-20 rounded-full" />
                                    </div>
                                </div>
                                <Skeleton className="h-8 w-8 rounded-md" />
                            </div>
                        </CardHeader>
                        <CardContent className="pb-4">
                            <div className="space-y-3">
                                <div className="space-y-1">
                                    <Skeleton className="h-3 w-full" />
                                    <Skeleton className="h-3 w-5/6" />
                                </div>
                                <div className="pt-2 border-t">
                                    <div className="flex items-center justify-between">
                                        <div className="space-y-1">
                                            <Skeleton className="h-3 w-24" />
                                            <Skeleton className="h-5 w-32" />
                                        </div>
                                        <Skeleton className="h-8 w-20 rounded-md" />
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    )
}
