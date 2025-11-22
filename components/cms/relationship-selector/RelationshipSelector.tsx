"use client"

import React, { useState, useEffect } from "react"
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Search, Loader2, Check, AlertCircle } from "lucide-react"
import { cmsApi } from "@/lib/api/cms"
import { useDebounce } from "@/hooks/use-debounce"
import { cn } from "@/lib/utils"

interface RelationshipEntry {
    id: string
    data: Record<string, any>
}

interface RelationshipSelectorProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    projectId: string
    collectionId: string
    selectedId?: string | string[]
    onSelect: (entry: RelationshipEntry | RelationshipEntry[] | null) => void
    displayField?: string
    multiple?: boolean
}

export function RelationshipSelector({
    open,
    onOpenChange,
    projectId,
    collectionId,
    selectedId,
    onSelect,
    displayField = "name",
    multiple = false,
}: RelationshipSelectorProps) {
    const [searchQuery, setSearchQuery] = useState("")
    const [entries, setEntries] = useState<RelationshipEntry[]>([])
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [selectedEntries, setSelectedEntries] = useState<string[]>(() => {
        if (Array.isArray(selectedId)) return selectedId
        if (selectedId) return [selectedId]
        return []
    })
    
    const debouncedSearch = useDebounce(searchQuery, 300)

    useEffect(() => {
        if (open) {
            fetchEntries()
        }
    }, [open, debouncedSearch])

    useEffect(() => {
        if (Array.isArray(selectedId)) {
            setSelectedEntries(selectedId)
        } else if (selectedId) {
            setSelectedEntries([selectedId])
        } else {
            setSelectedEntries([])
        }
    }, [selectedId])

    const fetchEntries = async () => {
        if (!collectionId || !projectId) return

        setIsLoading(true)
        setError(null)

        try {
            const result = await cmsApi.entries.getByCollection(
                projectId,
                collectionId,
                {
                    search: debouncedSearch || undefined,
                    limit: 50,
                }
            )
            setEntries(result.data)
        } catch (err) {
            console.error("Failed to fetch entries:", err)
            setError("Failed to load entries. Please try again.")
        } finally {
            setIsLoading(false)
        }
    }

    const handleSelect = (entry: RelationshipEntry) => {
        if (multiple) {
            setSelectedEntries(prev => {
                if (prev.includes(entry.id)) {
                    return prev.filter(id => id !== entry.id)
                } else {
                    return [...prev, entry.id]
                }
            })
        } else {
            if (selectedEntries.includes(entry.id)) {
                setSelectedEntries([])
            } else {
                setSelectedEntries([entry.id])
            }
        }
    }

    const handleConfirm = () => {
        if (multiple) {
            const selected = entries.filter(e => selectedEntries.includes(e.id))
            onSelect(selected.length > 0 ? selected : null)
        } else {
            const selected = entries.find(e => e.id === selectedEntries[0])
            onSelect(selected || null)
        }
        onOpenChange(false)
    }

    const getEntryDisplay = (entry: RelationshipEntry) => {
        const data = entry.data
        
        if (data[displayField]) {
            return String(data[displayField])
        }
        
        if (data.name) return String(data.name)
        if (data.title) return String(data.title)
        if (data.slug) return String(data.slug)
        
        return `Entry ${entry.id.slice(0, 8)}`
    }

    const getEntrySecondary = (entry: RelationshipEntry) => {
        const data = entry.data
        
        if (data.slug && displayField !== "slug") {
            return data.slug
        }
        
        return entry.id.slice(0, 8)
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-2xl max-h-[80vh] flex flex-col p-0">
                <DialogHeader className="px-6 pt-6 pb-4">
                    <DialogTitle>Select Related Entry</DialogTitle>
                </DialogHeader>

                <div className="px-6 pb-4">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                            placeholder="Search entries by name or slug..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="pl-10"
                        />
                    </div>
                </div>

                <ScrollArea className="flex-1 px-6">
                    {isLoading ? (
                        <div className="flex flex-col items-center justify-center py-12 text-center">
                            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground mb-3" />
                            <p className="text-sm text-muted-foreground">Loading entries...</p>
                        </div>
                    ) : error ? (
                        <div className="flex flex-col items-center justify-center py-12 text-center">
                            <AlertCircle className="h-8 w-8 text-destructive mb-3" />
                            <p className="text-sm text-destructive">{error}</p>
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={fetchEntries}
                                className="mt-4"
                            >
                                Try Again
                            </Button>
                        </div>
                    ) : entries.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-12 text-center">
                            <p className="text-sm text-muted-foreground">
                                {searchQuery ? "No entries found matching your search" : "No entries available"}
                            </p>
                        </div>
                    ) : (
                        <div className="space-y-1 pb-4">
                            {entries.map((entry) => {
                                const isSelected = selectedEntries.includes(entry.id)

                                return (
                                    <button
                                        key={entry.id}
                                        type="button"
                                        onClick={() => handleSelect(entry)}
                                        className={cn(
                                            "w-full text-left px-4 py-3 rounded-lg border transition-colors",
                                            isSelected
                                                ? "bg-primary/10 border-primary"
                                                : "border-transparent hover:bg-muted"
                                        )}
                                    >
                                        <div className="flex items-start justify-between gap-3">
                                            <div className="flex-1 min-w-0">
                                                <p className="font-medium text-sm truncate">
                                                    {getEntryDisplay(entry)}
                                                </p>
                                                <p className="text-xs text-muted-foreground truncate mt-0.5">
                                                    {getEntrySecondary(entry)}
                                                </p>
                                            </div>
                                            {isSelected && (
                                                <Check className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                                            )}
                                        </div>
                                    </button>
                                )
                            })}
                        </div>
                    )}
                </ScrollArea>

                <div className="border-t px-6 py-4 flex items-center justify-between">
                    <p className="text-sm text-muted-foreground">
                        {selectedEntries.length > 0
                            ? `${selectedEntries.length} ${selectedEntries.length === 1 ? 'entry' : 'entries'} selected`
                            : "No entry selected"}
                    </p>
                    <div className="flex items-center gap-2">
                        <Button
                            variant="outline"
                            onClick={() => onOpenChange(false)}
                        >
                            Cancel
                        </Button>
                        <Button onClick={handleConfirm}>
                            Confirm
                        </Button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    )
}
