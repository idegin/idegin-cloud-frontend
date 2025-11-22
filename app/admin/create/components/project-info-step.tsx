"use client"

import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Skeleton } from "@/components/ui/skeleton"

interface ProjectInfoStepProps {
    data: {
        name: string
        description: string
        budget: string
        maxStorageGB: string
    }
    onChange: (data: any) => void
    isLoading?: boolean
}

export function ProjectInfoStep({ data, onChange, isLoading }: ProjectInfoStepProps) {
    if (isLoading) {
        return (
            <div className="space-y-6">
                <div className="space-y-2">
                    <Skeleton className="h-4 w-24" />
                    <Skeleton className="h-11 w-full" />
                </div>
                <div className="space-y-2">
                    <Skeleton className="h-4 w-24" />
                    <Skeleton className="h-32 w-full" />
                </div>
                <div className="space-y-2">
                    <Skeleton className="h-4 w-24" />
                    <Skeleton className="h-11 w-full" />
                </div>
            </div>
        )
    }

    return (
        <div className="space-y-6">
            <div className="space-y-2">
                <Label htmlFor="name" className="text-sm font-medium">
                    Project Name
                </Label>
                <Input
                    id="name"
                    placeholder="e.g., Company Website Redesign"
                    value={data.name}
                    onChange={(e) => onChange({ name: e.target.value })}
                    className="h-11"
                />
                <p className="text-xs text-muted-foreground">
                    A descriptive name for your project
                </p>
            </div>

            <div className="space-y-2">
                <Label htmlFor="description" className="text-sm font-medium">
                    Description
                </Label>
                <Textarea
                    id="description"
                    placeholder="Provide a detailed description of the project scope, objectives, and deliverables..."
                    value={data.description}
                    onChange={(e) => onChange({ description: e.target.value })}
                    className="min-h-[120px] resize-none"
                />
                <p className="text-xs text-muted-foreground">
                    Describe the project goals and key requirements
                </p>
            </div>

            <div className="space-y-2">
                <Label htmlFor="budget" className="text-sm font-medium">
                    Budget
                </Label>
                <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                        $
                    </span>
                    <Input
                        id="budget"
                        type="number"
                        placeholder="10000"
                        value={data.budget}
                        onChange={(e) => onChange({ budget: e.target.value })}
                        className="h-11 pl-7"
                        min="0"
                        step="100"
                    />
                </div>
                <p className="text-xs text-muted-foreground">
                    Estimated project budget in USD
                </p>
            </div>

            <div className="space-y-2">
                <Label htmlFor="maxStorageGB" className="text-sm font-medium">
                    Max Storage (GB)
                </Label>
                <Input
                    id="maxStorageGB"
                    type="number"
                    placeholder="1"
                    value={data.maxStorageGB}
                    onChange={(e) => onChange({ maxStorageGB: e.target.value })}
                    className="h-11"
                    min="1"
                    step="1"
                />
                <p className="text-xs text-muted-foreground">
                    Maximum storage allocation in GB (default: 1 GB)
                </p>
            </div>
        </div>
    )
}

