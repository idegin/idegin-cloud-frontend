"use client"

import React from "react"
import { cn } from "@/lib/utils"
import { FIELD_TYPES_CONFIG, type FieldTypeConfig } from "./field-types-config"

export type FieldType = FieldTypeConfig

interface FieldTypeSelectorProps {
    onSelect: (fieldType: FieldType) => void
    excludeTypes?: string[]
}

export function FieldTypeSelector({ onSelect, excludeTypes = [] }: FieldTypeSelectorProps) {
    return (
        <div className="space-y-4 select-none">
            <div>
                <h3 className="text-lg font-semibold">Select Field Type</h3>
                <p className="text-sm text-muted-foreground mt-1">
                    Choose the type of field you want to add to your collection
                </p>
            </div>

            <div className="grid grid-cols-2 gap-3 max-h-[500px] overflow-y-auto pr-2">
                {FIELD_TYPES_CONFIG.filter(ft => !excludeTypes.includes(ft.type)).map((fieldType) => {
                    const IconComponent = fieldType.icon
                    
                    return (
                        <button
                            key={fieldType.type}
                            onClick={() => onSelect(fieldType)}
                            className={cn(
                                "flex items-start gap-3 p-4 rounded-lg border-2 transition-all text-left",
                                "hover:shadow-md hover:scale-[1.02] active:scale-[0.98]",
                                fieldType.color
                            )}
                        >
                            <div className="shrink-0 mt-0.5">
                                <IconComponent className="h-5 w-5" />
                            </div>
                            <div className="flex-1 min-w-0">
                                <h4 className="font-semibold text-sm mb-0.5">
                                    {fieldType.label}
                                </h4>
                                <p className="text-xs opacity-80 line-clamp-2">
                                    {fieldType.description}
                                </p>
                            </div>
                        </button>
                    )
                })}
            </div>
        </div>
    )
}
