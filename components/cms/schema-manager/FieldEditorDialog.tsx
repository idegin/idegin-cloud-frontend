"use client"

import React, { useState, useEffect } from "react"
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { FieldTypeSelector, type FieldType } from "./FieldTypeSelector"
import { FieldCustomizer } from "./FieldCustomizer"
import type { SchemaField } from "./SchemaManager"
import { FIELD_TYPES_CONFIG } from "./field-types-config"

interface FieldEditorDialogProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    onSave: (field: Omit<SchemaField, "id">) => void
    initialData?: SchemaField
    collectionName?: string
    existingFields?: SchemaField[]
    excludeTypes?: string[]
}

export function FieldEditorDialog({
    open,
    onOpenChange,
    onSave,
    initialData,
    collectionName,
    existingFields = [],
    excludeTypes = [],
}: FieldEditorDialogProps) {
    const [selectedFieldType, setSelectedFieldType] = useState<FieldType | null>(null)

    const normalizeFieldType = (type: string): string => {
        const typeMap: Record<string, string> = {
            'text': 'string',
            'richtext': 'rich_text',
            'textarea': 'string',
        }
        return typeMap[type] || type
    }

    useEffect(() => {
        if (initialData) {
            const normalizedType = normalizeFieldType(initialData.type)
            const matchingType = FIELD_TYPES_CONFIG.find((ft) => ft.type === normalizedType)
            
            if (!matchingType) {
                console.warn(`Unknown field type: "${initialData.type}" (normalized: "${normalizedType}")`)
                // Default to string type if no match found
                const defaultType = FIELD_TYPES_CONFIG.find((ft) => ft.type === 'string')
                setSelectedFieldType(defaultType || null)
            } else {
                setSelectedFieldType(matchingType)
            }
        } else {
            setSelectedFieldType(null)
        }
    }, [initialData])

    const handleFieldTypeSelect = (fieldType: FieldType) => {
        setSelectedFieldType(fieldType)
    }

    const handleBack = () => {
        setSelectedFieldType(null)
    }

    const handleSubmit = (field: Omit<SchemaField, "id">) => {
        onSave(field)
        onOpenChange(false)
        setSelectedFieldType(null)
    }

    const handleCancel = () => {
        onOpenChange(false)
        setSelectedFieldType(null)
    }

    // Reset when dialog closes
    const handleOpenChange = (open: boolean) => {
        onOpenChange(open)
        if (!open) {
            setSelectedFieldType(null)
        }
    }

    return (
        <Dialog open={open} onOpenChange={handleOpenChange}>
            <DialogContent className="md:min-w-[50rem] max-h-[90vh] overflow-hidden flex flex-col">
                <DialogHeader>
                    <DialogTitle>
                        {initialData
                            ? "Edit Field"
                            : selectedFieldType
                                ? "Configure Field"
                                : "Add New Field"
                        }
                    </DialogTitle>
                    {collectionName && (
                        <p className="text-sm text-muted-foreground mt-1">
                            Collection: <span className="font-medium">{collectionName}</span>
                        </p>
                    )}
                </DialogHeader>

                <div className="flex-1 overflow-y-auto px-1">
                    {!selectedFieldType ? (
                        initialData ? (
                            // Loading state while we find the matching field type
                            <div className="flex items-center justify-center py-8">
                                <div className="text-sm text-muted-foreground">Loading...</div>
                            </div>
                        ) : (
                            <FieldTypeSelector onSelect={handleFieldTypeSelect} excludeTypes={excludeTypes} />
                        )
                    ) : (
                        <FieldCustomizer
                            fieldType={selectedFieldType}
                            initialData={initialData}
                            onSubmit={handleSubmit}
                            onCancel={handleCancel}
                            onBack={!initialData ? handleBack : undefined}
                            existingFields={existingFields}
                        />
                    )}
                </div>
            </DialogContent>
        </Dialog>
    )
}
