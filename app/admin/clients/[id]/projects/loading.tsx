import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"

export default function ProjectsLoading() {
    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div className="space-y-2">
                    <Button variant="ghost" disabled className="-ml-2">
                        <ArrowLeft className="h-4 w-4 mr-2" />
                        Back to Organization
                    </Button>
                    <Skeleton className="h-9 w-72" />
                    <Skeleton className="h-4 w-96" />
                </div>
                <Skeleton className="h-10 w-40" />
            </div>

            {/* Stats Cards */}
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                {Array.from({ length: 4 }).map((_, i) => (
                    <Card key={i}>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <Skeleton className="h-4 w-28" />
                            <Skeleton className="h-4 w-4 rounded" />
                        </CardHeader>
                        <CardContent>
                            <Skeleton className="h-8 w-16 mb-2" />
                            <Skeleton className="h-3 w-32" />
                        </CardContent>
                    </Card>
                ))}
            </div>

            {/* Projects List Card */}
            <Card>
                <CardHeader>
                    <div className="flex items-center justify-between mb-4">
                        <div className="space-y-1">
                            <Skeleton className="h-6 w-32" />
                            <Skeleton className="h-4 w-40" />
                        </div>
                    </div>
                    <div className="flex flex-col sm:flex-row gap-4">
                        <Skeleton className="h-10 flex-1" />
                        <Skeleton className="h-10 w-full sm:w-[180px]" />
                        <Skeleton className="h-10 w-full sm:w-[180px]" />
                    </div>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        {Array.from({ length: 6 }).map((_, i) => (
                            <div key={i} className="flex items-center justify-between p-4 border rounded-lg">
                                <div className="flex-1 space-y-3">
                                    <div className="flex items-center gap-3">
                                        <Skeleton className="h-5 w-48" />
                                        <Skeleton className="h-5 w-24 rounded-full" />
                                    </div>
                                    <Skeleton className="h-4 w-full max-w-2xl" />
                                    <Skeleton className="h-4 w-3/4 max-w-xl" />
                                    <div className="flex items-center gap-4">
                                        <Skeleton className="h-3 w-28" />
                                        <Skeleton className="h-3 w-32" />
                                        <Skeleton className="h-3 w-28 rounded-full" />
                                    </div>
                                </div>
                                <Skeleton className="h-5 w-5 ml-4" />
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
