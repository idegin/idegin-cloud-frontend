"use client"

import { useState } from "react"
import { MetricsCards } from "./(components)/MetricsCards"
import { RevenueChart } from "./(components)/RevenueChart"
import { OverviewLoading } from "./(components)/OverviewLoading"
import { usePlatformOverview } from "@/lib/hooks/use-system"
import { SectionPlaceholder } from "@/components/shared/section-placeholder"
import { TimePeriod } from "@/lib/api/system"
import { Button } from "@/components/ui/button"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { RefreshCw } from "lucide-react"

const PERIOD_OPTIONS = [
    { value: "week" as TimePeriod, label: "This Week" },
    { value: "month" as TimePeriod, label: "This Month" },
    { value: "year" as TimePeriod, label: "This Year" },
    { value: "all" as TimePeriod, label: "All Time" },
]

export default function AdminOverviewPage() {
    const [period, setPeriod] = useState<TimePeriod>("year")
    const { data, isLoading, error, refetch, isFetching } = usePlatformOverview(period)

    const handleRefresh = () => {
        refetch()
    }

    if (isLoading) {
        return <OverviewLoading />
    }

    if (error) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <SectionPlaceholder
                    variant="error"
                    title="Failed to load platform overview"
                    description="We encountered an error while fetching the platform data. Please try again."
                    action={{
                        label: "Retry",
                        onClick: () => refetch(),
                        variant: "default"
                    }}
                />
            </div>
        )
    }

    if (!data) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <SectionPlaceholder
                    variant="info"
                    title="No data available"
                    description="Platform overview data is not available at this time."
                    action={{
                        label: "Refresh",
                        onClick: () => refetch(),
                        variant: "default"
                    }}
                />
            </div>
        )
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Platform Overview</h1>
                    <p className="text-muted-foreground mt-1">
                        Monitor your platform's performance and health at a glance
                    </p>
                </div>
                <div className="flex items-center gap-3">
                    <Select value={period} onValueChange={(value) => setPeriod(value as TimePeriod)}>
                        <SelectTrigger className="w-[160px]">
                            <SelectValue placeholder="Select period" />
                        </SelectTrigger>
                        <SelectContent>
                            {PERIOD_OPTIONS.map((option) => (
                                <SelectItem key={option.value} value={option.value}>
                                    {option.label}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                    <Button
                        variant="outline"
                        size="icon"
                        onClick={handleRefresh}
                        disabled={isFetching}
                        className="h-10 w-10"
                    >
                        <RefreshCw className={`h-4 w-4 ${isFetching ? "animate-spin" : ""}`} />
                        <span className="sr-only">Refresh</span>
                    </Button>
                </div>
            </div>

            <MetricsCards metrics={data.metrics} period={period} />

            <div className="grid gap-6 lg:grid-cols-7">
                <div className="lg:col-span-7">
                    <RevenueChart revenueData={data.revenueData} period={period} />
                </div>
            </div>

        </div>
    )
}
