"use client"

import React, { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Loader2 } from "lucide-react"
import { cmsApi } from "@/lib/api/cms"

interface RelatedCollectionDisplayProps {
    collectionId?: string
    projectId: string
    onChangeClick: () => void
}

export function RelatedCollectionDisplay({
    collectionId,
    projectId,
    onChangeClick,
}: RelatedCollectionDisplayProps) {
    const [collectionName, setCollectionName] = useState<string>("")
    const [isLoading, setIsLoading] = useState(false)

    useEffect(() => {
        if (collectionId && projectId) {
            setIsLoading(true)
            cmsApi.collections
                .getById(projectId, collectionId)
                .then((collection) => {
                    setCollectionName(collection.name)
                })
                .catch((error) => {
                    console.error("Failed to fetch collection:", error)
                    setCollectionName("Unknown Collection")
                })
                .finally(() => {
                    setIsLoading(false)
                })
        } else {
            setCollectionName("")
        }
    }, [collectionId, projectId])

    return (
        <>
            <Button
                type="button"
                variant="outline"
                className="w-full justify-start"
                onClick={onChangeClick}
                disabled={isLoading}
            >
                {isLoading ? (
                    <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Loading...
                    </>
                ) : collectionId && collectionName ? (
                    collectionName
                ) : (
                    "Select Collection"
                )}
            </Button>
            {collectionId && collectionName && !isLoading && (
                <p className="text-xs text-muted-foreground">
                    Collection ID: {collectionId}
                </p>
            )}
        </>
    )
}
