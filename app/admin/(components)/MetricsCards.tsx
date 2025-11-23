"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
    Building2,
    FolderKanban,
    DollarSign,
    Activity,
    TrendingUp,
    TrendingDown,
} from "lucide-react"
import type { PlatformMetrics, TimePeriod } from "@/lib/api/system"

interface MetricsCardsProps {
    metrics: PlatformMetrics
    period: TimePeriod
}

const PERIOD_LABELS: Record<TimePeriod, string> = {
    week: "vs last week",
    month: "vs last month",
    year: "vs last year",
    all: "all-time",
}

export function MetricsCards({ metrics, period }: MetricsCardsProps) {
    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat("en-NG", {
            style: "currency",
            currency: "NGN",
            minimumFractionDigits: 0,
        }).format(amount)
    }

    const periodLabel = PERIOD_LABELS[period]
    const showGrowth = period !== "all"

    const metricCards = [
        {
            title: "Total Organizations",
            value: metrics.totalOrganizations.toLocaleString(),
            icon: Building2,
            iconColor: "text-blue-600",
            iconBg: "bg-blue-500/10",
            growth: metrics.organizationsGrowth,
            description: "Active clients",
        },
        {
            title: "Total Projects",
            value: metrics.totalProjects.toLocaleString(),
            icon: FolderKanban,
            iconColor: "text-emerald-600",
            iconBg: "bg-emerald-500/10",
            growth: metrics.projectsGrowth,
            description: "Hosted applications",
        },
        {
            title: "Total Revenue",
            value: formatCurrency(metrics.totalRevenue),
            icon: DollarSign,
            iconColor: "text-amber-600",
            iconBg: "bg-amber-500/10",
            growth: metrics.revenueGrowth,
            description: period === "all" ? "All-time earnings" : "Period earnings",
        },
        {
            title: "Active Subscriptions",
            value: metrics.activeSubscriptions.toLocaleString(),
            icon: Activity,
            iconColor: "text-purple-600",
            iconBg: "bg-purple-500/10",
            growth: metrics.subscriptionsGrowth,
            description: "Paying projects",
        },
    ]

    return (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {metricCards.map((metric) => {
                const Icon = metric.icon
                const isPositive = metric.growth >= 0
                const GrowthIcon = isPositive ? TrendingUp : TrendingDown

                return (
                    <Card key={metric.title}>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">
                                {metric.title}
                            </CardTitle>
                            <div className={`p-2 rounded-lg ${metric.iconBg}`}>
                                <Icon className={`h-4 w-4 ${metric.iconColor}`} />
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{metric.value}</div>
                            {showGrowth && (
                                <div className="flex items-center gap-1 mt-1">
                                    <GrowthIcon
                                        className={`h-3 w-3 ${
                                            isPositive ? "text-green-600" : "text-red-600"
                                        }`}
                                    />
                                    <span
                                        className={`text-xs font-medium ${
                                            isPositive ? "text-green-600" : "text-red-600"
                                        }`}
                                    >
                                        {isPositive ? "+" : ""}
                                        {metric.growth}%
                                    </span>
                                    <span className="text-xs text-muted-foreground ml-1">
                                        {periodLabel}
                                    </span>
                                </div>
                            )}
                            {!showGrowth && (
                                <p className="text-xs text-muted-foreground mt-1">
                                    {metric.description}
                                </p>
                            )}
                        </CardContent>
                    </Card>
                )
            })}
        </div>
    )
}
