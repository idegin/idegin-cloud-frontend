"use client"

import React, { memo } from "react"
import { Label } from "@/components/ui/label"
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip"
import { Info } from "lucide-react"
import { cn } from "@/lib/utils"

interface CMSFieldContainerProps {
    label: string
    htmlFor?: string
    helpText?: string
    required?: boolean
    error?: string
    children: React.ReactNode
    className?: string
}

const CMSFieldContainerComponent = ({
    label,
    htmlFor,
    helpText,
    required,
    error,
    children,
    className,
}: CMSFieldContainerProps) => {
    return (
        <div className={cn("space-y-2", className)}>
            <div className="flex items-center gap-">
                <Label htmlFor={htmlFor} className="text-sm font-medium">
                    {label}
                    {required && <span className="text-destructive">*</span>}
                </Label>
                {helpText && (
                    <TooltipProvider>
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <Info className="h-3 w-3 text-muted-foreground cursor-help ml-2" />
                            </TooltipTrigger>
                            <TooltipContent>
                                <p className="max-w-xs text-sm">{helpText}</p>
                            </TooltipContent>
                        </Tooltip>
                    </TooltipProvider>
                )}
            </div>
            {children}
            {error && (
                <p className="text-sm text-destructive">{error}</p>
            )}
        </div>
    )
}

export const CMSFieldContainer = memo(CMSFieldContainerComponent)
