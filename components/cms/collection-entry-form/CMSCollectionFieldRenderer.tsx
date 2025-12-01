"use client"

import React, { useState, memo, useMemo, useCallback, useEffect, useRef } from "react"
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
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

interface NestedSchemaItemProps {
    itemValue: Record<string, any>
    nestedFields: any[]
    field: CMSCollectionField
    projectId?: string
    onChange: (updatedItem: Record<string, any>) => void
}

const NestedSchemaItem = memo(({ itemValue, nestedFields, field, projectId, onChange }: NestedSchemaItemProps) => {
    const [localState, setLocalState] = useState<Record<string, any>>(itemValue || {})
    const debounceRef = useRef<NodeJS.Timeout | null>(null)
    const isInitialMount = useRef(true)

    useEffect(() => {
        if (isInitialMount.current) {
            isInitialMount.current = false
            return
        }
        
        if (debounceRef.current) {
            clearTimeout(debounceRef.current)
        }
        
        debounceRef.current = setTimeout(() => {
            onChange(localState)
        }, 150)
        
        return () => {
            if (debounceRef.current) {
                clearTimeout(debounceRef.current)
            }
        }
    }, [localState, onChange])

    useEffect(() => {
        if (JSON.stringify(itemValue) !== JSON.stringify(localState)) {
            setLocalState(itemValue || {})
        }
    }, [itemValue])

    const updateField = useCallback((fieldKey: string, fieldValue: any) => {
        setLocalState(prev => ({ ...prev, [fieldKey]: fieldValue }))
    }, [])

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {nestedFields.map((nestedField: any) => {
                const nestedFieldType = nestedField.type?.toLowerCase() || "short_text"
                const isNestedFullWidth = nestedFieldType === "rich_text" || 
                                          nestedFieldType === "long_text" ||
                                          nestedFieldType === "file" ||
                                          nestedFieldType === "json"
                
                const nestedFieldConfig: CMSCollectionField = {
                    id: `${field.id}-${nestedField.key}`,
                    collectionId: field.collectionId,
                    schemaId: field.schemaId,
                    parentFieldId: field.id,
                    indexOrder: "0",
                    defaultBooleanValue: false,
                    defaultStringValue: "",
                    fieldConfig: {
                        key: nestedField.key,
                        label: nestedField.label,
                        type: nestedField.type,
                        placeholder: nestedField.placeholder,
                        helpText: nestedField.helpText,
                    },
                    validationRules: { 
                        required: nestedField.required,
                        maxLength: nestedField.maxLength,
                        minLength: nestedField.minLength,
                    },
                    configOptions: nestedField.configOptions || {},
                    dropdownOptions: nestedField.dropdownOptions || [],
                    relatedCollectionId: nestedField.relatedCollectionId,
                    createdById: "",
                    createdAt: new Date().toISOString(),
                    updatedAt: new Date().toISOString(),
                }
                
                return (
                    <div 
                        key={nestedField.key} 
                        className={cn(isNestedFullWidth && "md:col-span-2")}
                    >
                        <CMSCollectionFieldRenderer
                            field={nestedFieldConfig}
                            value={localState[nestedField.key]}
                            onChange={(v) => updateField(nestedField.key, v)}
                            projectId={projectId}
                        />
                    </div>
                )
            })}
        </div>
    )
})

NestedSchemaItem.displayName = "NestedSchemaItem"

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
                        projectId={projectId || ""}
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
                        const currentArray = Array.isArray(value) ? value : []
                        onChange([...currentArray, newItem])
                    }
                }
                
                const removeNestedItem = (index: number) => {
                    if (isMultipleNested && Array.isArray(value)) {
                        onChange(value.filter((_, i) => i !== index))
                    }
                }
                
                const handleItemChange = useCallback((index: number, updatedItem: Record<string, any>) => {
                    if (isMultipleNested && Array.isArray(value)) {
                        const currentArray = [...value]
                        currentArray[index] = updatedItem
                        onChange(currentArray)
                    }
                }, [isMultipleNested, value, onChange])
                
                const handleSingleItemChange = useCallback((updatedItem: Record<string, any>) => {
                    onChange(updatedItem)
                }, [onChange])
                
                return (
                    <div className="space-y-4">
                        {isMultipleNested ? (
                            <>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {(nestedValue as any[]).map((item, index) => (
                                        <Card key={index} className="p-4 space-y-4 border-l-4 border-l-pink-500">
                                            <div className="flex items-center justify-between">
                                                <span className="text-sm font-medium text-muted-foreground">
                                                    Item {index + 1}
                                                </span>
                                                <AlertDialog>
                                                    <AlertDialogTrigger asChild>
                                                        <Button
                                                            type="button"
                                                            variant="ghost"
                                                            size="sm"
                                                            className="text-destructive hover:text-destructive"
                                                        >
                                                            <Trash2 className="h-4 w-4" />
                                                        </Button>
                                                    </AlertDialogTrigger>
                                                    <AlertDialogContent>
                                                        <AlertDialogHeader>
                                                            <AlertDialogTitle>Delete Item {index + 1}?</AlertDialogTitle>
                                                            <AlertDialogDescription>
                                                                This action cannot be undone. This will permanently delete this item and all its data.
                                                            </AlertDialogDescription>
                                                        </AlertDialogHeader>
                                                        <AlertDialogFooter>
                                                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                                                            <AlertDialogAction
                                                                onClick={() => removeNestedItem(index)}
                                                                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                                                            >
                                                                Delete
                                                            </AlertDialogAction>
                                                        </AlertDialogFooter>
                                                    </AlertDialogContent>
                                                </AlertDialog>
                                            </div>
                                            <NestedSchemaItem
                                                itemValue={item}
                                                nestedFields={nestedFields}
                                                field={field}
                                                projectId={projectId}
                                                onChange={(updatedItem) => handleItemChange(index, updatedItem)}
                                            />
                                        </Card>
                                    ))}
                                </div>
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
                            <Card className="p-4 border-l-4 border-l-pink-500">
                                <NestedSchemaItem
                                    itemValue={nestedValue as Record<string, any>}
                                    nestedFields={nestedFields}
                                    field={field}
                                    projectId={projectId}
                                    onChange={handleSingleItemChange}
                                />
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
