"use client"

import React, { useState, memo, useMemo, useCallback } from "react"
import { CMSFieldContainer } from "./CMSFieldContainer"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Calendar } from "@/components/ui/calendar"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"
import { Button } from "@/components/ui/button"
import { CalendarIcon } from "lucide-react"
import { format } from "date-fns"
import { cn } from "@/lib/utils"
import type { CMSCollectionField } from "@/lib/api/cms"
import { RichTextEditor } from "@/components/cms/rich-text-editor"
import { SlugInput } from "@/components/cms/slug-input"
import { FileDropzone, type UploadedFile } from "@/components/cms/file-dropzone"
import { RelationshipSelector } from "@/components/cms/relationship-selector"
import { Card } from "@/components/ui/card"
import { Plus, Trash2 } from "lucide-react"
import { getFieldTypeConfig } from "@/components/cms/schema-manager/field-types-config"

interface CMSCollectionFieldRendererProps {
    field: CMSCollectionField
    value: any
    onChange: (value: any) => void
    error?: string
    projectId?: string
    getFormData?: () => Record<string, any>
    onFieldChange?: (key: string, value: any) => void
}

const CMSCollectionFieldRendererComponent = ({
    field,
    value,
    onChange,
    error,
    projectId,
    getFormData,
    onFieldChange,
}: CMSCollectionFieldRendererProps) => {
    const { fieldConfig, validationRules, configOptions, dropdownOptions, relatedCollectionId } = field
    const isRequired = validationRules?.required === true
    const isHidden = fieldConfig?.hidden === true
    
    const [relationshipDialogOpen, setRelationshipDialogOpen] = useState(false)
    
    // Get relationship display name from populated data
    const selectedRelationshipName = useMemo(() => {
        if (fieldConfig?.type !== "relationship" || !value) return ""
        
        const isMultiple = configOptions?.relationshipConfig?.isMultiple === true
        
        // Helper to extract display name from entry object
        const getDisplayName = (item: any): string => {
            if (typeof item === "string") return item // Fallback for IDs
            if (typeof item !== "object" || item === null) return ""
            
            // Check if data exists (from RelationshipSelector or backend population)
            const dataObj = item.data || item
            return dataObj.name || dataObj.title || dataObj.slug || item.id || ""
        }
        
        if (isMultiple && Array.isArray(value)) {
            // Multiple relationships
            return value.map(getDisplayName).filter(Boolean).join(", ")
        } else {
            // Single relationship
            return getDisplayName(value)
        }
    }, [fieldConfig?.type, value, configOptions?.relationshipConfig?.isMultiple])

    if (isHidden) {
        return null
    }

    const generateSlug = useCallback((text: string) => {
        return text
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, "-")
            .replace(/^-+|-+$/g, "")
    }, [])

    const handleAutoGenerateSlug = useCallback(() => {
        // Get the source field from configOptions.slugSource
        const slugSource = configOptions?.slugSource || "name"
        const currentFormData = getFormData?.()
        const sourceValue = currentFormData?.[slugSource] || ""
        
        if (sourceValue && onFieldChange) {
            const newSlug = generateSlug(String(sourceValue))
            onFieldChange(fieldConfig.key, newSlug)
        }
    }, [configOptions?.slugSource, getFormData, onFieldChange, fieldConfig.key, generateSlug])

    const renderField = () => {
        const fieldType = fieldConfig?.type?.toLowerCase() || "short_text"
        const maxLength = validationRules?.maxLength
        const minLength = validationRules?.minLength
        const currentLength = typeof value === 'string' ? value.length : 0

        const renderCharacterCount = () => {
            if (!maxLength && !minLength) return null
            const isOverMax = maxLength && currentLength > maxLength
            const isUnderMin = minLength && currentLength < minLength
            
            return (
                <div className={cn(
                    "text-xs mt-1",
                    isOverMax ? "text-destructive" : isUnderMin ? "text-amber-500" : "text-muted-foreground"
                )}>
                    {currentLength}{maxLength ? `/${maxLength}` : ''} characters
                    {minLength && currentLength < minLength && ` (min: ${minLength})`}
                </div>
            )
        }

        switch (fieldType) {
            case "short_text":
            case "url":
            case "email":
                return (
                    <div>
                        <Input
                            id={fieldConfig.key}
                            type={fieldType === "email" ? "email" : fieldType === "url" ? "url" : "text"}
                            placeholder={fieldConfig.placeholder || `Enter ${fieldConfig.label}`}
                            value={value || ""}
                            onChange={(e) => onChange(e.target.value)}
                            className={error ? "border-destructive" : ""}
                            maxLength={maxLength}
                        />
                        {fieldType === "short_text" && renderCharacterCount()}
                    </div>
                )

            case "slug":
                return (
                    <SlugInput
                        value={value || ""}
                        onChange={onChange}
                        onReload={handleAutoGenerateSlug}
                        placeholder={fieldConfig.placeholder || "enter-slug-here"}
                        error={!!error}
                    />
                )

            case "long_text":
                return (
                    <div>
                        <Textarea
                            id={fieldConfig.key}
                            placeholder={fieldConfig.placeholder || `Enter ${fieldConfig.label}`}
                            value={value || ""}
                            onChange={(e) => onChange(e.target.value)}
                            className={cn("min-h-[100px]", error ? "border-destructive" : "")}
                            rows={configOptions?.rows || 4}
                            maxLength={maxLength}
                        />
                        {renderCharacterCount()}
                    </div>
                )

            case "number":
                return (
                    <Input
                        id={fieldConfig.key}
                        type="number"
                        placeholder={fieldConfig.placeholder || `Enter ${fieldConfig.label}`}
                        value={value || ""}
                        onChange={(e) => onChange(e.target.valueAsNumber || null)}
                        className={error ? "border-destructive" : ""}
                        step={configOptions?.step || "any"}
                        min={configOptions?.min}
                        max={configOptions?.max}
                    />
                )

            case "boolean":
                return (
                    <div className="flex items-center space-x-2">
                        <Checkbox
                            id={fieldConfig.key}
                            checked={value === true}
                            onCheckedChange={(checked) => onChange(checked === true)}
                        />
                        <label
                            htmlFor={fieldConfig.key}
                            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                        >
                            {fieldConfig.placeholder || `Enable ${fieldConfig.label}`}
                        </label>
                    </div>
                )

            case "dropdown":
                return (
                    <Select
                        value={value || ""}
                        onValueChange={onChange}
                    >
                        <SelectTrigger
                            id={fieldConfig.key}
                            className={cn("w-full", {
                                "border-destructive": error
                            })}
                        >
                            <SelectValue placeholder={fieldConfig.placeholder || `Select ${fieldConfig.label}`} />
                        </SelectTrigger>
                        <SelectContent>
                            {dropdownOptions && dropdownOptions.length > 0 ? (
                                dropdownOptions.map((option: any) => (
                                    <SelectItem
                                        key={option.value || option}
                                        value={option.value || option}
                                    >
                                        {option.label || option}
                                    </SelectItem>
                                ))
                            ) : (
                                <SelectItem value="no-options" disabled>
                                    No options available
                                </SelectItem>
                            )}
                        </SelectContent>
                    </Select>
                )

            case "rich_text":
            case "rich-text":
                return (
                    <RichTextEditor
                        value={value || ""}
                        onChange={onChange}
                        placeholder={fieldConfig.placeholder || `Enter ${fieldConfig.label}`}
                        error={!!error}
                    />
                )

            case "date":
                return (
                    <Popover>
                        <PopoverTrigger asChild>
                            <Button
                                id={fieldConfig.key}
                                variant="outline"
                                className={cn(
                                    "w-full justify-start text-left font-normal",
                                    !value && "text-muted-foreground",
                                    error && "border-destructive"
                                )}
                            >
                                <CalendarIcon className="mr-2 h-4 w-4" />
                                {value ? format(new Date(value), "PPP") : <span>{fieldConfig.placeholder || "Pick a date"}</span>}
                            </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0">
                            <Calendar
                                mode="single"
                                selected={value ? new Date(value) : undefined}
                                onSelect={(date) => onChange(date?.toISOString())}
                                initialFocus
                            />
                        </PopoverContent>
                    </Popover>
                )

            case "time":
                return (
                    <Input
                        id={fieldConfig.key}
                        type="time"
                        value={value || ""}
                        onChange={(e) => onChange(e.target.value)}
                        className={error ? "border-destructive" : ""}
                    />
                )

            case "timestamp":
                return (
                    <Input
                        id={fieldConfig.key}
                        type="datetime-local"
                        value={value || ""}
                        onChange={(e) => onChange(e.target.value)}
                        className={error ? "border-destructive" : ""}
                    />
                )

            case "file":
                const fileTypeMap: Record<string, string[]> = {
                    "image/*": [".jpg", ".jpeg", ".png", ".gif", ".webp", ".svg"],
                    "video/*": [".mp4", ".webm", ".ogg"],
                    "audio/*": [".mp3", ".wav", ".ogg"],
                    "application/pdf": [".pdf"],
                    "application/msword": [".doc"],
                    "application/vnd.openxmlformats-officedocument.wordprocessingml.document": [".docx"],
                    "application/vnd.ms-excel": [".xls"],
                    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": [".xlsx"],
                }

                const allowedTypes = configOptions?.allowedTypes || []
                const acceptTypes: Record<string, string[]> = {}
                
                allowedTypes.forEach((type: string) => {
                    if (fileTypeMap[type]) {
                        acceptTypes[type] = fileTypeMap[type]
                    }
                })

                const filesValue: UploadedFile[] = Array.isArray(value) ? value : value ? [value] : []
                
                const isMultipleFile = validationRules?.multiple !== false
                const maxFiles = isMultipleFile 
                    ? (configOptions?.maxFiles || undefined) 
                    : 1

                return (
                    <FileDropzone
                        value={filesValue}
                        onChange={onChange}
                        accept={Object.keys(acceptTypes).length > 0 ? acceptTypes : undefined}
                        maxFiles={maxFiles}
                        maxSize={configOptions?.maxSize}
                        error={!!error}
                    />
                )

            case "json":
                return (
                    <Textarea
                        id={fieldConfig.key}
                        placeholder={fieldConfig.placeholder || `Enter valid JSON for ${fieldConfig.label}`}
                        value={typeof value === "object" ? JSON.stringify(value, null, 2) : value || ""}
                        onChange={(e) => {
                            try {
                                const parsed = JSON.parse(e.target.value)
                                onChange(parsed)
                            } catch {
                                onChange(e.target.value)
                            }
                        }}
                        className={cn("font-mono text-sm min-h-[120px]", error ? "border-destructive" : "")}
                        rows={8}
                    />
                )

            case "relationship":
                if (!relatedCollectionId || !projectId) {
                    return (
                        <Input
                            value="Missing configuration"
                            disabled
                            className="text-muted-foreground"
                        />
                    )
                }
                
                const isMultiple = configOptions?.relationshipConfig?.isMultiple === true
                
                const extractId = (item: any): string => {
                    if (typeof item === "string") return item
                    if (typeof item === "object" && item !== null) return item.id
                    return ""
                }
                
                const selectedIds = isMultiple && Array.isArray(value) 
                    ? value.map(extractId).filter(Boolean)
                    : value 
                        ? [extractId(value)].filter(Boolean)
                        : []
                
                return (
                    <>
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => setRelationshipDialogOpen(true)}
                            className={cn(
                                "w-full justify-start text-left font-normal",
                                (!value || (Array.isArray(value) && value.length === 0)) && "text-muted-foreground",
                                error && "border-destructive"
                            )}
                        >
                            {selectedRelationshipName || fieldConfig.placeholder || `Select related ${fieldConfig.label}`}
                        </Button>
                        
                        <RelationshipSelector
                            open={relationshipDialogOpen}
                            onOpenChange={setRelationshipDialogOpen}
                            projectId={projectId}
                            collectionId={relatedCollectionId}
                            selectedId={isMultiple ? selectedIds : selectedIds[0]}
                            multiple={isMultiple}
                            onSelect={(selected) => {
                                if (!selected) {
                                    onChange(isMultiple ? [] : null)
                                } else if (Array.isArray(selected)) {
                                    onChange(selected)
                                } else {
                                    onChange(selected)
                                }
                            }}
                        />
                    </>
                )

            case "nested_schema":
                const nestedFields = configOptions?.nestedSchemaConfig?.fields || []
                const isMultipleNested = configOptions?.nestedSchemaConfig?.isMultiple === true
                
                if (nestedFields.length === 0) {
                    return (
                        <Input
                            value="No nested fields configured"
                            disabled
                            className="text-muted-foreground"
                        />
                    )
                }
                
                const nestedValue = isMultipleNested 
                    ? (Array.isArray(value) ? value : [])
                    : (value && typeof value === "object" ? value : {})
                
                const addNestedItem = () => {
                    if (isMultipleNested) {
                        const newItem: Record<string, any> = {}
                        nestedFields.forEach((nf: any) => {
                            newItem[nf.key] = null
                        })
                        onChange([...nestedValue as any[], newItem])
                    }
                }
                
                const removeNestedItem = (index: number) => {
                    if (isMultipleNested && Array.isArray(nestedValue)) {
                        onChange(nestedValue.filter((_, i) => i !== index))
                    }
                }
                
                const updateNestedField = (index: number | null, fieldKey: string, fieldValue: any) => {
                    if (isMultipleNested && typeof index === "number" && Array.isArray(nestedValue)) {
                        const updated = [...nestedValue]
                        updated[index] = { ...updated[index], [fieldKey]: fieldValue }
                        onChange(updated)
                    } else if (!isMultipleNested) {
                        onChange({ ...nestedValue as Record<string, any>, [fieldKey]: fieldValue })
                    }
                }
                
                const renderNestedFields = (itemValue: Record<string, any>, itemIndex: number | null) => {
                    return nestedFields.map((nestedField: any) => {
                        const fieldTypeConfig = getFieldTypeConfig(nestedField.type)
                        const FieldIcon = fieldTypeConfig?.icon
                        
                        return (
                            <div key={nestedField.key} className="space-y-2">
                                <div className="flex items-center gap-2">
                                    {FieldIcon && (
                                        <div className={cn(
                                            "inline-flex items-center justify-center rounded-md p-1",
                                            fieldTypeConfig.displayColor
                                        )}>
                                            <FieldIcon className="h-3 w-3" />
                                        </div>
                                    )}
                                    <span className="text-sm font-medium">{nestedField.label}</span>
                                    {nestedField.required && <span className="text-red-500">*</span>}
                                </div>
                                <CMSCollectionFieldRenderer
                                    field={{
                                        ...field,
                                        fieldConfig: nestedField,
                                        validationRules: { required: nestedField.required },
                                        configOptions: nestedField.configOptions || {},
                                        dropdownOptions: nestedField.dropdownOptions || []
                                    }}
                                    value={itemValue?.[nestedField.key]}
                                    onChange={(v) => updateNestedField(itemIndex, nestedField.key, v)}
                                    projectId={projectId}
                                />
                            </div>
                        )
                    })
                }
                
                return (
                    <div className="space-y-4">
                        {isMultipleNested ? (
                            <>
                                {(nestedValue as any[]).map((item, index) => (
                                    <Card key={index} className="p-4 space-y-4 border-l-4 border-l-pink-500">
                                        <div className="flex items-center justify-between">
                                            <span className="text-sm font-medium text-muted-foreground">
                                                Item {index + 1}
                                            </span>
                                            <Button
                                                type="button"
                                                variant="ghost"
                                                size="sm"
                                                onClick={() => removeNestedItem(index)}
                                                className="text-destructive hover:text-destructive"
                                            >
                                                <Trash2 className="h-4 w-4" />
                                            </Button>
                                        </div>
                                        {renderNestedFields(item, index)}
                                    </Card>
                                ))}
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={addNestedItem}
                                    className="w-full"
                                >
                                    <Plus className="h-4 w-4 mr-2" />
                                    Add Item
                                </Button>
                            </>
                        ) : (
                            <Card className="p-4 space-y-4 border-l-4 border-l-pink-500">
                                {renderNestedFields(nestedValue as Record<string, any>, null)}
                            </Card>
                        )}
                    </div>
                )

            default:
                return (
                    <Input
                        id={fieldConfig.key}
                        type="text"
                        placeholder={fieldConfig.placeholder || `Enter ${fieldConfig.label}`}
                        value={value || ""}
                        onChange={(e) => onChange(e.target.value)}
                        className={error ? "border-destructive" : ""}
                    />
                )
        }
    }

    return (
        <CMSFieldContainer
            label={fieldConfig?.label || "Field"}
            htmlFor={fieldConfig?.key}
            helpText={fieldConfig?.helpText}
            required={isRequired}
            error={error}
        >
            {renderField()}
        </CMSFieldContainer>
    )
}

export const CMSCollectionFieldRenderer = memo(CMSCollectionFieldRendererComponent, (prevProps, nextProps) => {
    if (prevProps.field.id !== nextProps.field.id) return false
    if (prevProps.projectId !== nextProps.projectId) return false
    if (prevProps.error !== nextProps.error) return false
    
    if (prevProps.value !== nextProps.value) {
        if (typeof prevProps.value === 'object' && typeof nextProps.value === 'object') {
            return JSON.stringify(prevProps.value) === JSON.stringify(nextProps.value)
        }
        return false
    }
    
    return true
})
