"use client"

import type { LucideIcon } from "lucide-react"
import { 
    AlertCircle, 
    AlertTriangle, 
    Info, 
    CheckCircle2,
    HelpCircle
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

type PlaceholderVariant = "error" | "warning" | "info" | "success" | "default"

interface SectionPlaceholderProps {
    variant?: PlaceholderVariant
    icon?: LucideIcon
    title: string
    description?: string
    action?: {
        label: string
        onClick: () => void
        variant?: "default" | "outline" | "ghost" | "destructive"
    }
    secondaryAction?: {
        label: string
        onClick: () => void
        variant?: "default" | "outline" | "ghost" | "destructive"
    }
    className?: string
}

const variantConfig: Record<
    PlaceholderVariant,
    {
        icon: LucideIcon
        iconClassName: string
        iconBgClassName: string
        titleClassName?: string
    }
> = {
    error: {
        icon: AlertCircle,
        iconClassName: "text-destructive",
        iconBgClassName: "bg-destructive/10",
        titleClassName: "text-destructive",
    },
    warning: {
        icon: AlertTriangle,
        iconClassName: "text-warning",
        iconBgClassName: "bg-warning/10",
        titleClassName: "text-warning",
    },
    info: {
        icon: Info,
        iconClassName: "text-primary",
        iconBgClassName: "bg-primary/10",
        titleClassName: "text-primary",
    },
    success: {
        icon: CheckCircle2,
        iconClassName: "text-success",
        iconBgClassName: "bg-success/10",
        titleClassName: "text-success",
    },
    default: {
        icon: HelpCircle,
        iconClassName: "text-muted-foreground",
        iconBgClassName: "bg-muted",
    },
}

export function SectionPlaceholder({
    variant = "default",
    icon,
    title,
    description,
    action,
    secondaryAction,
    className,
}: SectionPlaceholderProps) {
    const config = variantConfig[variant]
    const Icon = icon || config.icon

    return (
        <div className={cn("py-12 text-center", className)}>
            <div
                className={cn(
                    "h-16 w-16 rounded-full mx-auto mb-4 flex items-center justify-center",
                    config.iconBgClassName
                )}
            >
                <Icon className={cn("h-8 w-8", config.iconClassName)} />
            </div>

            <h3
                className={cn(
                    "font-semibold text-xl mb-2",
                    config.titleClassName
                )}
            >
                {title}
            </h3>

            {description && (
                <p className="text-sm text-muted-foreground mb-6 max-w-md mx-auto">
                    {description}
                </p>
            )}

            {(action || secondaryAction) && (
                <div className="flex items-center justify-center gap-3">
                    {action && (
                        <Button
                            onClick={action.onClick}
                            variant={action.variant || "default"}
                        >
                            {action.label}
                        </Button>
                    )}
                    {secondaryAction && (
                        <Button
                            onClick={secondaryAction.onClick}
                            variant={secondaryAction.variant || "outline"}
                        >
                            {secondaryAction.label}
                        </Button>
                    )}
                </div>
            )}
        </div>
    )
}
