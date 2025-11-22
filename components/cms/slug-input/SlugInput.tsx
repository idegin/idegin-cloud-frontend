"use client"

import React, { useState } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { RotateCw, Loader2 } from "lucide-react"
import { cn } from "@/lib/utils"

interface SlugInputProps {
    value?: string
    onChange?: (value: string) => void
    onReload?: () => void | Promise<void>
    placeholder?: string
    disabled?: boolean
    loading?: boolean
    error?: boolean
    className?: string
}

export function SlugInput({
    value,
    onChange,
    onReload,
    placeholder = "enter-slug-here",
    disabled = false,
    loading = false,
    error = false,
    className,
}: SlugInputProps) {
    const [isReloading, setIsReloading] = useState(false)

    const handleReload = async () => {
        if (onReload && !isReloading && !loading && !disabled) {
            setIsReloading(true)
            try {
                await onReload()
            } finally {
                setIsReloading(false)
            }
        }
    }

    const formatSlug = (text: string) => {
        return text
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, "-")
            .replace(/^-+|-+$/g, "")
    }

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const formatted = formatSlug(e.target.value)
        onChange?.(formatted)
    }

    return (
        <div className={cn("relative", className)}>
            <Input
                type="text"
                value={value || ""}
                onChange={handleChange}
                placeholder={placeholder}
                disabled={disabled || loading}
                className={cn(
                    "pr-10 font-mono",
                    error && "border-destructive"
                )}
            />
            {onReload && (
                <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={handleReload}
                    disabled={disabled || loading || isReloading}
                    className="absolute right-1 top-1/2 -translate-y-1/2 h-7 w-7 p-0"
                    title="Regenerate slug"
                >
                    {isReloading || loading ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                        <RotateCw className="h-4 w-4" />
                    )}
                </Button>
            )}
        </div>
    )
}
