import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { Button } from "@/components/ui/button"
import { ChevronLeft } from "lucide-react"

export function ProjectDetailsLoading() {
    return (
        <div className="space-y-6">
            <Button variant="ghost" disabled className="mb-4">
                <ChevronLeft className="h-4 w-4 mr-2" />
                Back to Projects
            </Button>

            <div>
                <div className="flex items-start justify-between mb-2">
                    <div className="flex-1">
                        <Skeleton className="h-9 w-80 mb-2" />
                        <Skeleton className="h-4 w-96" />
                    </div>
                    <Skeleton className="h-6 w-24" />
                </div>
                <Skeleton className="h-3 w-40" />
            </div>

            <div className="grid gap-6 md:grid-cols-2">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <Skeleton className="h-4 w-32" />
                        <Skeleton className="h-4 w-4 rounded" />
                    </CardHeader>
                    <CardContent>
                        <Skeleton className="h-9 w-40 mb-2" />
                        <Skeleton className="h-3 w-56" />
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <Skeleton className="h-4 w-32" />
                        <Skeleton className="h-4 w-4 rounded" />
                    </CardHeader>
                    <CardContent>
                        <Skeleton className="h-9 w-40 mb-2" />
                        <Skeleton className="h-3 w-56 mb-3" />
                        <Skeleton className="h-9 w-full" />
                    </CardContent>
                </Card>
            </div>

            <Card className="border-none p-0 px-0">
                <CardHeader className='p-0'>
                    <Skeleton className="h-7 w-40 mb-2" />
                    <Skeleton className="h-4 w-72" />
                </CardHeader>
                <CardContent className='p-0'>
                    <div className="space-y-4">
                        <div className="rounded-md border">
                            <div className="p-4 border-b">
                                <div className="grid grid-cols-5 gap-4">
                                    <Skeleton className="h-4 w-20" />
                                    <Skeleton className="h-4 w-20" />
                                    <Skeleton className="h-4 w-20" />
                                    <Skeleton className="h-4 w-20" />
                                    <Skeleton className="h-4 w-20 ml-auto" />
                                </div>
                            </div>
                            {[1, 2, 3, 4, 5].map((i) => (
                                <div key={i} className="p-4 border-b last:border-b-0">
                                    <div className="grid grid-cols-5 gap-4 items-center">
                                        <Skeleton className="h-4 w-24" />
                                        <Skeleton className="h-5 w-16" />
                                        <Skeleton className="h-4 w-28" />
                                        <Skeleton className="h-4 w-24" />
                                        <Skeleton className="h-8 w-20 ml-auto" />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
