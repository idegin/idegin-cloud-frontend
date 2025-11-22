"use client"

import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip"

interface UserAvatarProps {
    name: string
    size?: "sm" | "md" | "lg"
    showTooltip?: boolean
}

export function UserAvatar({ name, size = "md", showTooltip = true }: UserAvatarProps) {
    const initials = name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .slice(0, 2)
        .toUpperCase()

    const sizeClasses = {
        sm: "h-6 w-6 text-xs",
        md: "h-8 w-8 text-sm",
        lg: "h-10 w-10 text-base",
    }

    const avatar = (
        <Avatar className={sizeClasses[size]}>
            <AvatarFallback className="bg-primary/10 text-primary font-medium">
                {initials}
            </AvatarFallback>
        </Avatar>
    )

    if (!showTooltip) {
        return avatar
    }

    return (
        <TooltipProvider>
            <Tooltip>
                <TooltipTrigger asChild>
                    <div className="cursor-default flex justify-center">{avatar}</div>
                </TooltipTrigger>
                <TooltipContent>
                    <p>{name}</p>
                </TooltipContent>
            </Tooltip>
        </TooltipProvider>
    )
}
