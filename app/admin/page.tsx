"use client"

import { MetricsCards } from "./(components)/MetricsCards"
import { RevenueChart } from "./(components)/RevenueChart"
import { OverviewLoading } from "./(components)/OverviewLoading"
import { usePlatformOverview } from "@/lib/hooks/use-system"
import { SectionPlaceholder } from "@/components/shared/section-placeholder"

export default function AdminOverviewPage() {
    const currentYear = new Date().getFullYear()
    const { data, isLoading, error, refetch } = usePlatformOverview(currentYear)

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
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Platform Overview</h1>
                <p className="text-muted-foreground mt-1">
                    Monitor your platform's performance and health at a glance
                </p>
            </div>

            <MetricsCards metrics={data.metrics} />

            <div className="grid gap-6 lg:grid-cols-7">
                <div className="lg:col-span-7">
                    <RevenueChart revenueData={data.revenueData} year={data.year} />
                </div>
            </div>

        </div>
    )
}
