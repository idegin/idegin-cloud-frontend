"use client"

import { useState, useEffect } from "react"
import { Search, Check } from "lucide-react"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { cn } from "@/lib/utils"
import { useCMSCollections } from "@/lib/hooks/cms"
import type { CMSCollection } from "@/lib/api/cms"

interface CollectionSelectorDialogProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    projectId: string
    isMultiple?: boolean
    selectedIds?: string[]
    onSelect: (collectionIds: string[]) => void
}

export function CollectionSelectorDialog({
    open,
    onOpenChange,
    projectId,
    isMultiple = false,
    selectedIds = [],
    onSelect,
}: CollectionSelectorDialogProps) {
    const [searchQuery, setSearchQuery] = useState("")
    const [selectedCollections, setSelectedCollections] = useState<string[]>(selectedIds)
    
    const { data: collectionsData, isLoading } = useCMSCollections(projectId, {
        search: searchQuery,
    })

    const collections = (collectionsData || []) as CMSCollection[]

    useEffect(() => {
        setSelectedCollections(selectedIds)
    }, [selectedIds])

    const handleToggleCollection = (collectionId: string) => {
        if (isMultiple) {
            setSelectedCollections(prev =>
                prev.includes(collectionId)
                    ? prev.filter(id => id !== collectionId)
                    : [...prev, collectionId]
            )
        } else {
            setSelectedCollections([collectionId])
        }
    }

    const handleConfirm = () => {
        onSelect(selectedCollections)
        onOpenChange(false)
    }

    const getCollectionName = (id: string) => {
        const collection = collections.find((c: CMSCollection) => c.id === id)
        return collection?.name || id
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                    <DialogTitle>
                        Select Collection{isMultiple ? "s" : ""}
                    </DialogTitle>
                    <DialogDescription>
                        {isMultiple
                            ? "Choose one or more collections to relate to this field"
                            : "Choose a collection to relate to this field"}
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-4">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                        <Input
                            placeholder="Search collections..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="pl-9"
                        />
                    </div>

                    {selectedCollections.length > 0 && (
                        <div className="flex flex-wrap gap-2">
                            {selectedCollections.map(id => (
                                <div
                                    key={id}
                                    className="inline-flex items-center gap-1 px-2 py-1 text-xs font-medium rounded-md bg-primary/10 text-primary"
                                >
                                    {getCollectionName(id)}
                                    <button
                                        type="button"
                                        onClick={() => handleToggleCollection(id)}
                                        className="hover:bg-primary/20 rounded p-0.5"
                                    >
                                        ×
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}

                    <ScrollArea className="h-[300px] rounded-md border">
                        {isLoading ? (
                            <div className="flex items-center justify-center h-full">
                                <p className="text-sm text-muted-foreground">Loading collections...</p>
                            </div>
                        ) : collections.length === 0 ? (
                            <div className="flex items-center justify-center h-full">
                                <p className="text-sm text-muted-foreground">
                                    {searchQuery ? "No collections found" : "No collections available"}
                                </p>
                            </div>
                        ) : (
                            <div className="p-2 space-y-1">
                                {collections.map((collection: CMSCollection) => {
                                    const isSelected = selectedCollections.includes(collection.id)
                                    return (
                                        <button
                                            key={collection.id}
                                            type="button"
                                            onClick={() => handleToggleCollection(collection.id)}
                                            className={cn(
                                                "w-full flex items-center justify-between p-3 rounded-lg transition-colors text-left",
                                                isSelected
                                                    ? "bg-primary text-primary-foreground"
                                                    : "hover:bg-muted"
                                            )}
                                        >
                                            <div className="flex-1">
                                                <p className="font-medium text-sm">{collection.name}</p>
                                                <p className={cn(
                                                    "text-xs mt-0.5",
                                                    isSelected
                                                        ? "text-primary-foreground/70"
                                                        : "text-muted-foreground"
                                                )}>
                                                    {collection.slug}
                                                </p>
                                            </div>
                                            {isSelected && (
                                                <Check className="h-4 w-4 ml-2 flex-shrink-0" />
                                            )}
                                        </button>
                                    )
                                })}
                            </div>
                        )}
                    </ScrollArea>

                    <div className="flex justify-end gap-2">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => onOpenChange(false)}
                        >
                            Cancel
                        </Button>
                        <Button
                            type="button"
                            onClick={handleConfirm}
                            disabled={selectedCollections.length === 0}
                        >
                            Confirm Selection
                        </Button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    )
}
