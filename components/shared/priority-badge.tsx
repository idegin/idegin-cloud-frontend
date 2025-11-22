import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

interface PriorityBadgeProps {
  priority: "low" | "medium" | "high" | "critical"
  variant?: "default" | "secondary" | "outline"
  className?: string
}

const priorityColorMap = {
  low: "bg-gray-500/10 text-gray-700 dark:text-gray-400",
  medium: "bg-blue-500/10 text-blue-700 dark:text-blue-400",
  high: "bg-orange-500/10 text-orange-700 dark:text-orange-400",
  critical: "bg-red-500/10 text-red-700 dark:text-red-400",
}

export function PriorityBadge({ priority, variant = "outline", className }: PriorityBadgeProps) {
  return (
    <Badge variant={variant} className={cn(priorityColorMap[priority], className)}>
      {priority}
    </Badge>
  )
}
