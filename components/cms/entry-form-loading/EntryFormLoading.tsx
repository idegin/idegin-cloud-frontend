import { Skeleton } from "@/components/ui/skeleton"
import { Card, CardContent } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"

export function EntryFormLoading() {
    return (
        <div className="space-y-6">
            <div>
                <Skeleton className="h-8 w-64" />
                <Skeleton className="h-4 w-96 mt-2" />
            </div>

            <Separator />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                    <div key={i} className={i % 3 === 0 ? "md:col-span-2" : ""}>
                        <div className="space-y-2">
                            <Skeleton className="h-4 w-32" />
                            <Skeleton className={`h-10 w-full ${i % 3 === 0 ? "h-32" : ""}`} />
                            <Skeleton className="h-3 w-48" />
                        </div>
                    </div>
                ))}
            </div>

            <Separator />

            <div className="flex items-center justify-between">
                <Skeleton className="h-4 w-48" />
                <div className="flex items-center gap-3">
                    <Skeleton className="h-10 w-24" />
                    <Skeleton className="h-10 w-32" />
                </div>
            </div>
        </div>
    )
}
