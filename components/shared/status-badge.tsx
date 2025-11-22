import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

interface StatusBadgeProps {
  status: string
  variant?: "default" | "secondary" | "outline"
  className?: string
}

const statusColorMap: Record<string, string> = {
  // Project statuses
  active: "bg-green-500/10 text-green-700 dark:text-green-400",
  inactive: "bg-gray-500/10 text-gray-700 dark:text-gray-400",
  pending: "bg-yellow-500/10 text-yellow-700 dark:text-yellow-400",
  completed: "bg-blue-500/10 text-blue-700 dark:text-blue-400",
  archived: "bg-red-500/10 text-red-700 dark:text-red-400",

  // Hosting statuses
  paused: "bg-yellow-500/10 text-yellow-700 dark:text-yellow-400",
  cancelled: "bg-red-500/10 text-red-700 dark:text-red-400",

  // Invoice statuses
  paid: "bg-green-500/10 text-green-700 dark:text-green-400",
  failed: "bg-red-500/10 text-red-700 dark:text-red-400",
}

export function StatusBadge({ status, variant = "secondary", className }: StatusBadgeProps) {
  const colorClass = statusColorMap[status.toLowerCase()] || ""

  return (
    <Badge variant={variant} className={cn(colorClass, className)}>
      {status}
    </Badge>
  )
}
