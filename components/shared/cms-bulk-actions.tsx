"use client"

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Trash2, Copy, Archive, X } from "lucide-react"
import { cn } from "@/lib/utils"

interface CMSBulkActionsProps {
    selectedCount: number
    onClearSelection: () => void
    onDelete?: () => void
    onDuplicate?: () => void
    onArchive?: () => void
    className?: string
}

export function CMSBulkActions({
    selectedCount,
    onClearSelection,
    onDelete,
    onDuplicate,
    onArchive,
    className,
}: CMSBulkActionsProps) {
    if (selectedCount === 0) return null

    return (
        <div className={cn("fixed top-20 left-1/2 -translate-x-1/2 z-50 animate-in fade-in slide-in-from-top-2", className)}>
            <Card className="shadow-xl border-2 py-0">
                <div className="flex items-center gap-4 px-4 py-3">
                    <div className="flex items-center gap-2">
                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground text-sm font-medium">
                            {selectedCount}
                        </div>
                        <span className="text-sm font-medium">
                            {selectedCount} {selectedCount === 1 ? "item" : "items"} selected
                        </span>
                    </div>

                    <div className="h-6 w-px bg-border" />

                    <div className="flex items-center gap-2">
                        {onDuplicate && (
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={onDuplicate}
                                className="gap-2"
                            >
                                <Copy className="h-4 w-4" />
                                Duplicate
                            </Button>
                        )}

                        {onArchive && (
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={onArchive}
                                className="gap-2"
                            >
                                <Archive className="h-4 w-4" />
                                Archive
                            </Button>
                        )}

                        {onDelete && (
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={onDelete}
                                className="gap-2 text-destructive hover:bg-destructive hover:text-destructive-foreground"
                            >
                                <Trash2 className="h-4 w-4" />
                                Delete
                            </Button>
                        )}

                        <div className="h-6 w-px bg-border" />

                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={onClearSelection}
                            className="gap-2"
                        >
                            <X className="h-4 w-4" />
                            Clear
                        </Button>
                    </div>
                </div>
            </Card>
        </div>
    )
}
