"use client"

import React, { useState, useEffect, useRef } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Separator } from "@/components/ui/separator"
import { useDebounce } from "@/lib/hooks/use-debounce"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { Plus, X, ArrowLeft } from "lucide-react"
import { cn } from "@/lib/utils"
import type { FieldType } from "./FieldTypeSelector"
import type { SchemaField } from "./SchemaManager"
import { CollectionSelectorDialog } from "./CollectionSelectorDialog"
import { RelatedCollectionDisplay } from "./RelatedCollectionDisplay"
import { FieldEditorDialog } from "./FieldEditorDialog"
import { getFieldTypeConfig } from "./field-types-config"
import { useParams } from "next/navigation"

const MAX_LABEL_LENGTH = 100
const MAX_KEY_LENGTH = 100
const MAX_HELPTEXT_LENGTH = 500
const MAX_PLACEHOLDER_LENGTH = 200

function slugify(text: string): string {
    return text
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9]+/g, '_')
        .replace(/^_+|_+$/g, '')
}

interface FieldCustomizerProps {
    fieldType: FieldType
    initialData?: SchemaField
    onSubmit: (field: Omit<SchemaField, "id">) => void
    onCancel: () => void
    onBack?: () => void
    existingFields?: SchemaField[]
}

export function FieldCustomizer({ 
    fieldType, 
    initialData,
    onSubmit, 
    onCancel,
    onBack,
    existingFields = []
}: FieldCustomizerProps) {
    const params = useParams()
    const projectId = params?.projectId as string
    
    const hasManuallyEditedKey = useRef(false)
    const [collectionSelectorOpen, setCollectionSelectorOpen] = useState(false)
    const [selectedFileTypes, setSelectedFileTypes] = useState<string[]>(() => {
        if (initialData?.fileConfig?.allowedTypes && Array.isArray(initialData.fileConfig.allowedTypes)) {
            return initialData.fileConfig.allowedTypes
        }
        return []
    })
    
    const [dropdownOptions, setDropdownOptions] = useState<string[]>(() => {
        if (initialData?.dropdownOptions && Array.isArray(initialData.dropdownOptions) && initialData.dropdownOptions.length > 0) {
            return initialData.dropdownOptions
                .map(opt => typeof opt === 'string' ? opt : String(opt))
                .filter(opt => opt.trim())
        }
        return [""]
    })

    const [nestedFields, setNestedFields] = useState<SchemaField[]>(() => {
        if (initialData?.nestedSchemaConfig?.fields && Array.isArray(initialData.nestedSchemaConfig.fields)) {
            return initialData.nestedSchemaConfig.fields.map((f: any, idx: number) => ({
                id: `nested_${idx}`,
                label: f.label || "",
                key: f.key || "",
                type: f.type || "short_text",
                required: f.required || false,
                readonly: f.readonly || false,
                hidden: f.hidden || false,
                helpText: f.helpText,
                placeholder: f.placeholder,
                validation: f.validation || {},
                defaultValue: f.defaultValue
            }))
        }
        return []
    })

    const [isMultipleNested, setIsMultipleNested] = useState<boolean>(() => {
        return initialData?.nestedSchemaConfig?.isMultiple || false
    })

    const [nestedFieldEditorOpen, setNestedFieldEditorOpen] = useState(false)
    const [editingNestedField, setEditingNestedField] = useState<SchemaField | undefined>(undefined)

    const formSchema = z.object({
        label: z.string()
            .min(1, "Field label is required")
            .max(MAX_LABEL_LENGTH, `Label must not exceed ${MAX_LABEL_LENGTH} characters`)
            .regex(/^[a-zA-Z0-9\s-_]+$/, "Label can only contain letters, numbers, spaces, hyphens, and underscores"),
        key: z.string()
            .min(1, "Field key is required")
            .max(MAX_KEY_LENGTH, `Key must not exceed ${MAX_KEY_LENGTH} characters`)
            .regex(/^[a-z0-9_]+$/, "Key must be lowercase and contain only letters, numbers, and underscores")
            .refine((value) => {
                const existingKey = existingFields.find(f => 
                    f.key === value && f.id !== initialData?.id
                )
                return !existingKey
            }, "This field key already exists. Please use a different key."),
        helpText: z.string()
            .max(MAX_HELPTEXT_LENGTH, `Help text must not exceed ${MAX_HELPTEXT_LENGTH} characters`)
            .optional(),
        placeholder: z.string()
            .max(MAX_PLACEHOLDER_LENGTH, `Placeholder must not exceed ${MAX_PLACEHOLDER_LENGTH} characters`)
            .optional(),
        required: z.boolean(),
        readonly: z.boolean(),
        hidden: z.boolean(),
        minLength: z.string().optional(),
        maxLength: z.string().optional(),
        minValue: z.string().optional(),
        maxValue: z.string().optional(),
        stepValue: z.string().optional(),
        pattern: z.string().optional(),
        defaultValue: z.string().optional(),
        maxFileSize: z.string().optional(),
        allowMultipleFiles: z.boolean().optional(),
        minDate: z.string().optional(),
        maxDate: z.string().optional(),
        defaultToCurrent: z.boolean().optional(),
        booleanTrueLabel: z.string().optional(),
        booleanFalseLabel: z.string().optional(),
        relatedCollectionId: z.string().optional(),
        isMultipleRelationship: z.boolean().optional(),
    })

    type FormValues = z.infer<typeof formSchema>

    const form = useForm<FormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            label: initialData?.label || "",
            key: initialData?.key || "",
            helpText: initialData?.helpText || "",
            placeholder: initialData?.placeholder || "",
            required: initialData?.required || false,
            readonly: initialData?.readonly || false,
            hidden: initialData?.hidden || false,
            minLength: initialData?.validation?.minLength?.toString() || "",
            maxLength: initialData?.validation?.maxLength?.toString() || "",
            minValue: initialData?.validation?.minValue?.toString() || "",
            maxValue: initialData?.validation?.maxValue?.toString() || "",
            stepValue: initialData?.validation?.step?.toString() || "",
            pattern: initialData?.validation?.pattern || "",
            defaultValue: initialData?.defaultValue || "",
            maxFileSize: initialData?.fileConfig?.maxFileSize?.toString() || "",
            allowMultipleFiles: initialData?.fileConfig?.allowMultiple || false,
            minDate: initialData?.dateConfig?.minDate || "",
            maxDate: initialData?.dateConfig?.maxDate || "",
            defaultToCurrent: initialData?.dateConfig?.defaultToCurrent || false,
            booleanTrueLabel: initialData?.booleanConfig?.trueLabel || "Yes",
            booleanFalseLabel: initialData?.booleanConfig?.falseLabel || "No",
            relatedCollectionId: initialData?.relationshipConfig?.relatedCollectionId || "",
            isMultipleRelationship: initialData?.relationshipConfig?.isMultiple || false,
        },
    })

    const labelValue = form.watch("label")
    const keyValue = form.watch("key")
    const helpTextValue = form.watch("helpText") || ""
    const placeholderValue = form.watch("placeholder") || ""

    // Debounce the label value to prevent lag during typing
    const debouncedLabelValue = useDebounce(labelValue, 300)

    // Auto-generate key from label when creating new field (only if user hasn't manually edited it)
    useEffect(() => {
        if (!initialData && debouncedLabelValue && !hasManuallyEditedKey.current) {
            const slugifiedKey = slugify(debouncedLabelValue)
            form.setValue("key", slugifiedKey, { 
                shouldValidate: keyValue.length > 0 // Only validate if there's already a value
            })
        }
    }, [debouncedLabelValue, initialData, form, keyValue.length])

    const handleFormSubmit = (data: FormValues) => {
        const fieldData: Omit<SchemaField, "id"> = {
            label: data.label,
            key: data.key,
            type: fieldType.type,
            required: data.required,
            readonly: data.readonly,
            helpText: data.helpText || undefined,
            placeholder: data.placeholder || undefined,
            hidden: data.hidden,
            validation: {
                minLength: data.minLength ? parseInt(data.minLength) : undefined,
                maxLength: data.maxLength ? parseInt(data.maxLength) : undefined,
                minValue: data.minValue ? parseFloat(data.minValue) : undefined,
                maxValue: data.maxValue ? parseFloat(data.maxValue) : undefined,
                step: data.stepValue ? parseInt(data.stepValue) : undefined,
                pattern: data.pattern || undefined,
            },
            dropdownOptions: fieldType.type === "dropdown" 
                ? dropdownOptions.filter(opt => typeof opt === 'string' && opt.trim()) 
                : undefined,
            defaultValue: data.defaultValue || undefined,
            fileConfig: fieldType.type === "file" ? {
                allowedTypes: selectedFileTypes.length > 0 ? selectedFileTypes : undefined,
                maxFileSize: data.maxFileSize ? parseInt(data.maxFileSize) : undefined,
                allowMultiple: data.allowMultipleFiles,
            } : undefined,
            dateConfig: (fieldType.type === "date" || fieldType.type === "timestamp") ? {
                minDate: data.minDate || undefined,
                maxDate: data.maxDate || undefined,
                defaultToCurrent: data.defaultToCurrent,
            } : undefined,
            booleanConfig: fieldType.type === "boolean" ? {
                trueLabel: data.booleanTrueLabel || "Yes",
                falseLabel: data.booleanFalseLabel || "No",
            } : undefined,
            relationshipConfig: fieldType.type === "relationship" ? {
                relatedCollectionId: data.relatedCollectionId || undefined,
                isMultiple: data.isMultipleRelationship,
            } : undefined,
            nestedSchemaConfig: fieldType.type === "nested_schema" ? {
                fields: nestedFields.map(f => ({
                    label: f.label,
                    key: f.key,
                    type: f.type,
                    required: f.required,
                    placeholder: f.placeholder
                })),
                isMultiple: isMultipleNested,
            } : undefined,
        }

        onSubmit(fieldData)
    }

    const addDropdownOption = () => {
        setDropdownOptions([...dropdownOptions, ""])
    }

    const updateDropdownOption = (index: number, value: string) => {
        const updated = [...dropdownOptions]
        updated[index] = value
        setDropdownOptions(updated)
    }

    const removeDropdownOption = (index: number) => {
        setDropdownOptions(dropdownOptions.filter((_, i) => i !== index))
    }

    const IconComponent = fieldType.icon

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(handleFormSubmit)} className="space-y-6">
                {/* Header */}
                <div className="flex items-center gap-3">
                    {onBack && (
                        <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            onClick={onBack}
                            className="shrink-0"
                        >
                            <ArrowLeft className="h-4 w-4" />
                        </Button>
                    )}
                    <div className={cn(
                        "h-10 w-10 rounded-lg flex items-center justify-center shrink-0",
                        fieldType.color.split(' ').slice(0, 2).join(' ')
                    )}>
                        <IconComponent className="h-5 w-5" />
                    </div>
                    <div className="flex-1">
                        <h3 className="text-lg font-semibold">{fieldType.label} Field</h3>
                        <p className="text-sm text-muted-foreground">{fieldType.description}</p>
                    </div>
                </div>

                <Separator />

                {/* Basic Configuration */}
                <div className="space-y-4">
                    <FormField
                        control={form.control}
                        name="label"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>
                                    Field Label <span className="text-destructive">*</span>
                                </FormLabel>
                                <FormControl>
                                    <Input
                                        placeholder="e.g., Title, Description, Price"
                                        className="font-medium"
                                        {...field}
                                    />
                                </FormControl>
                                <div className="flex items-center justify-between">
                                    <FormDescription>
                                        The display name shown to users
                                    </FormDescription>
                                    <span className={cn(
                                        "text-xs",
                                        labelValue.length > MAX_LABEL_LENGTH
                                            ? "text-destructive"
                                            : labelValue.length > MAX_LABEL_LENGTH * 0.9
                                            ? "text-orange-500"
                                            : "text-muted-foreground"
                                    )}>
                                        {labelValue.length}/{MAX_LABEL_LENGTH}
                                    </span>
                                </div>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="key"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>
                                    Field Key <span className="text-destructive">*</span>
                                </FormLabel>
                                <FormControl>
                                    <Input
                                        placeholder="e.g., title, description, price"
                                        className="font-mono text-sm"
                                        {...field}
                                        onChange={(e) => {
                                            // Mark that user has manually edited the key
                                            if (!initialData) {
                                                hasManuallyEditedKey.current = true
                                            }
                                            field.onChange(e)
                                        }}
                                    />
                                </FormControl>
                                <div className="flex items-center justify-between">
                                    <FormDescription>
                                        Unique identifier used in code (lowercase, underscores only)
                                    </FormDescription>
                                    <span className={cn(
                                        "text-xs",
                                        keyValue.length > MAX_KEY_LENGTH
                                            ? "text-destructive"
                                            : keyValue.length > MAX_KEY_LENGTH * 0.9
                                            ? "text-orange-500"
                                            : "text-muted-foreground"
                                    )}>
                                        {keyValue.length}/{MAX_KEY_LENGTH}
                                    </span>
                                </div>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="helpText"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Help Text</FormLabel>
                                <FormControl>
                                    <Textarea
                                        placeholder="Additional information or instructions for users"
                                        rows={2}
                                        className="resize-none"
                                        {...field}
                                    />
                                </FormControl>
                                <div className="flex items-center justify-between">
                                    <FormDescription>
                                        Optional guidance for users
                                    </FormDescription>
                                    <span className={cn(
                                        "text-xs",
                                        helpTextValue.length > MAX_HELPTEXT_LENGTH
                                            ? "text-destructive"
                                            : helpTextValue.length > MAX_HELPTEXT_LENGTH * 0.9
                                            ? "text-orange-500"
                                            : "text-muted-foreground"
                                    )}>
                                        {helpTextValue.length}/{MAX_HELPTEXT_LENGTH}
                                    </span>
                                </div>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    {fieldType.type !== "boolean" && (
                        <FormField
                            control={form.control}
                            name="placeholder"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Placeholder</FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder="e.g., Enter your text here..."
                                            {...field}
                                        />
                                    </FormControl>
                                    <div className="flex items-center justify-between">
                                        <FormDescription>
                                            Example text shown in empty fields
                                        </FormDescription>
                                        <span className={cn(
                                            "text-xs",
                                            placeholderValue.length > MAX_PLACEHOLDER_LENGTH
                                                ? "text-destructive"
                                                : placeholderValue.length > MAX_PLACEHOLDER_LENGTH * 0.9
                                                ? "text-orange-500"
                                                : "text-muted-foreground"
                                        )}>
                                            {placeholderValue.length}/{MAX_PLACEHOLDER_LENGTH}
                                        </span>
                                    </div>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    )}
                </div>

                <Separator />

                {/* Field Options */}
                <div className="space-y-4">
                    <h4 className="text-sm font-semibold">Field Options</h4>
                    
                    <div className="space-y-3">
                        <FormField
                            control={form.control}
                            name="required"
                            render={({ field }) => (
                                <FormItem className="flex items-center justify-between p-3 rounded-lg border bg-card">
                                    <div className="space-y-0.5">
                                        <FormLabel className="text-sm font-medium cursor-pointer">
                                            Required Field
                                        </FormLabel>
                                        <FormDescription>
                                            Users must provide a value
                                        </FormDescription>
                                    </div>
                                    <FormControl>
                                        <Switch
                                            checked={field.value}
                                            onCheckedChange={field.onChange}
                                        />
                                    </FormControl>
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="readonly"
                            render={({ field }) => (
                                <FormItem className="flex items-center justify-between p-3 rounded-lg border bg-card">
                                    <div className="space-y-0.5">
                                        <FormLabel className="text-sm font-medium cursor-pointer">
                                            Read Only
                                        </FormLabel>
                                        <FormDescription>
                                            Field cannot be edited by users
                                        </FormDescription>
                                    </div>
                                    <FormControl>
                                        <Switch
                                            checked={field.value}
                                            onCheckedChange={field.onChange}
                                        />
                                    </FormControl>
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="hidden"
                            render={({ field }) => (
                                <FormItem className="flex items-center justify-between p-3 rounded-lg border bg-card">
                                    <div className="space-y-0.5">
                                        <FormLabel className="text-sm font-medium cursor-pointer">
                                            Hidden
                                        </FormLabel>
                                        <FormDescription>
                                            Hide from entry forms
                                        </FormDescription>
                                    </div>
                                    <FormControl>
                                        <Switch
                                            checked={field.value}
                                            onCheckedChange={field.onChange}
                                        />
                                    </FormControl>
                                </FormItem>
                            )}
                        />
                    </div>
                </div>

                {/* Validation Rules */}
                {(fieldType.type === "short_text" || fieldType.type === "long_text" || fieldType.type === "rich_text" || fieldType.type === "number") && (
                    <>
                        <Separator />
                        <div className="space-y-4">
                            <h4 className="text-sm font-semibold">Validation Rules</h4>
                            
                            {(fieldType.type === "short_text" || fieldType.type === "long_text" || fieldType.type === "rich_text") && (
                                <div className="grid grid-cols-2 gap-3">
                                    <FormField
                                        control={form.control}
                                        name="minLength"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Min Length</FormLabel>
                                                <FormControl>
                                                    <Input
                                                        type="number"
                                                        placeholder="e.g., 3"
                                                        min="0"
                                                        {...field}
                                                    />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name="maxLength"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Max Length</FormLabel>
                                                <FormControl>
                                                    <Input
                                                        type="number"
                                                        placeholder="e.g., 100"
                                                        min="0"
                                                        {...field}
                                                    />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>
                            )}

                            {fieldType.type === "number" && (
                                <>
                                    <div className="grid grid-cols-2 gap-3">
                                        <FormField
                                            control={form.control}
                                            name="minValue"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Min Value</FormLabel>
                                                    <FormControl>
                                                        <Input
                                                            type="number"
                                                            placeholder="e.g., 0"
                                                            {...field}
                                                        />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                        <FormField
                                            control={form.control}
                                            name="maxValue"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Max Value</FormLabel>
                                                    <FormControl>
                                                        <Input
                                                            type="number"
                                                            placeholder="e.g., 999"
                                                            {...field}
                                                        />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                    </div>
                                    <FormField
                                        control={form.control}
                                        name="stepValue"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Step Increment</FormLabel>
                                                <FormControl>
                                                    <Input
                                                        type="number"
                                                        placeholder="e.g., 1"
                                                        min="1"
                                                        {...field}
                                                    />
                                                </FormControl>
                                                <FormDescription>
                                                    Increment value for number stepping
                                                </FormDescription>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </>
                            )}

                            {fieldType.type === "short_text" && (
                                <FormField
                                    control={form.control}
                                    name="pattern"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Pattern (Regex)</FormLabel>
                                            <FormControl>
                                                <Input
                                                    placeholder="e.g., ^[A-Z0-9]+$"
                                                    className="font-mono text-sm"
                                                    {...field}
                                                />
                                            </FormControl>
                                            <FormDescription>
                                                Regular expression for custom validation
                                            </FormDescription>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            )}
                        </div>
                    </>
                )}

                {/* File Configuration */}
                {fieldType.type === "file" && (
                    <>
                        <Separator />
                        <div className="space-y-4">
                            <h4 className="text-sm font-semibold">File Configuration</h4>
                            
                            <div className="space-y-3">
                                <Label>Allowed File Types</Label>
                                <div className="grid grid-cols-2 gap-3">
                                    {[
                                        { value: "image/*", label: "Images" },
                                        { value: "video/*", label: "Videos" },
                                        { value: "audio/*", label: "Audio" },
                                        { value: "application/pdf", label: "PDF" },
                                        { value: "application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document", label: "Word Documents" },
                                        { value: "application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", label: "Excel Files" },
                                    ].map((fileType) => (
                                        <div key={fileType.value} className="flex items-center space-x-2">
                                            <Checkbox
                                                id={`file-type-${fileType.value}`}
                                                checked={selectedFileTypes.includes(fileType.value)}
                                                onCheckedChange={(checked) => {
                                                    if (checked) {
                                                        setSelectedFileTypes([...selectedFileTypes, fileType.value])
                                                    } else {
                                                        setSelectedFileTypes(selectedFileTypes.filter(t => t !== fileType.value))
                                                    }
                                                }}
                                            />
                                            <Label
                                                htmlFor={`file-type-${fileType.value}`}
                                                className="text-sm font-normal cursor-pointer"
                                            >
                                                {fileType.label}
                                            </Label>
                                        </div>
                                    ))}
                                </div>
                                {selectedFileTypes.length === 0 && (
                                    <p className="text-xs text-muted-foreground">
                                        No file type selected means all file types are allowed
                                    </p>
                                )}
                            </div>

                            <FormField
                                control={form.control}
                                name="maxFileSize"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Max File Size (MB)</FormLabel>
                                        <FormControl>
                                            <Input
                                                type="number"
                                                placeholder="e.g., 5"
                                                min="0"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormDescription>
                                            Maximum file size in megabytes
                                        </FormDescription>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="allowMultipleFiles"
                                render={({ field }) => (
                                    <FormItem className="flex items-center justify-between p-3 rounded-lg border bg-card">
                                        <div className="space-y-0.5">
                                            <FormLabel className="text-sm font-medium cursor-pointer">
                                                Allow Multiple Files
                                            </FormLabel>
                                            <FormDescription>
                                                Users can upload multiple files
                                            </FormDescription>
                                        </div>
                                        <FormControl>
                                            <Switch
                                                checked={field.value}
                                                onCheckedChange={field.onChange}
                                            />
                                        </FormControl>
                                    </FormItem>
                                )}
                            />
                        </div>
                    </>
                )}

                {/* Date/Timestamp Configuration */}
                {(fieldType.type === "date" || fieldType.type === "timestamp") && (
                    <>
                        <Separator />
                        <div className="space-y-4">
                            <h4 className="text-sm font-semibold">Date Range</h4>
                            
                            <div className="grid grid-cols-2 gap-3">
                                <FormField
                                    control={form.control}
                                    name="minDate"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Min Date</FormLabel>
                                            <FormControl>
                                                <Input
                                                    type="date"
                                                    {...field}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="maxDate"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Max Date</FormLabel>
                                            <FormControl>
                                                <Input
                                                    type="date"
                                                    {...field}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>

                            <FormField
                                control={form.control}
                                name="defaultToCurrent"
                                render={({ field }) => (
                                    <FormItem className="flex items-center justify-between p-3 rounded-lg border bg-card">
                                        <div className="space-y-0.5">
                                            <FormLabel className="text-sm font-medium cursor-pointer">
                                                Default to Current {fieldType.type === "timestamp" ? "Date/Time" : "Date"}
                                            </FormLabel>
                                            <FormDescription>
                                                Pre-fill with current {fieldType.type === "timestamp" ? "date and time" : "date"}
                                            </FormDescription>
                                        </div>
                                        <FormControl>
                                            <Switch
                                                checked={field.value}
                                                onCheckedChange={field.onChange}
                                            />
                                        </FormControl>
                                    </FormItem>
                                )}
                            />
                        </div>
                    </>
                )}

                {/* Boolean Configuration */}
                {fieldType.type === "boolean" && (
                    <>
                        <Separator />
                        <div className="space-y-4">
                            <h4 className="text-sm font-semibold">Display Labels</h4>
                            
                            <div className="space-y-3">
                                <FormField
                                    control={form.control}
                                    name="booleanTrueLabel"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>True Label</FormLabel>
                                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                <FormControl>
                                                    <SelectTrigger>
                                                        <SelectValue placeholder="Select label" />
                                                    </SelectTrigger>
                                                </FormControl>
                                                <SelectContent>
                                                    <SelectItem value="Yes">Yes</SelectItem>
                                                    <SelectItem value="On">On</SelectItem>
                                                    <SelectItem value="Active">Active</SelectItem>
                                                    <SelectItem value="Enabled">Enabled</SelectItem>
                                                    <SelectItem value="True">True</SelectItem>
                                                </SelectContent>
                                            </Select>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="booleanFalseLabel"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>False Label</FormLabel>
                                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                <FormControl>
                                                    <SelectTrigger>
                                                        <SelectValue placeholder="Select label" />
                                                    </SelectTrigger>
                                                </FormControl>
                                                <SelectContent>
                                                    <SelectItem value="No">No</SelectItem>
                                                    <SelectItem value="Off">Off</SelectItem>
                                                    <SelectItem value="Inactive">Inactive</SelectItem>
                                                    <SelectItem value="Disabled">Disabled</SelectItem>
                                                    <SelectItem value="False">False</SelectItem>
                                                </SelectContent>
                                            </Select>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>
                        </div>
                    </>
                )}

                {/* Relationship Configuration */}
                {fieldType.type === "relationship" && (
                    <>
                        <Separator />
                        <div className="space-y-4">
                            <h4 className="text-sm font-semibold">Relationship Settings</h4>
                            
                            <div className="space-y-3">
                                <div className="space-y-2">
                                    <Label>Related Collection</Label>
                                    <RelatedCollectionDisplay
                                        collectionId={form.watch("relatedCollectionId")}
                                        projectId={projectId}
                                        onChangeClick={() => setCollectionSelectorOpen(true)}
                                    />
                                </div>

                                <FormField
                                    control={form.control}
                                    name="isMultipleRelationship"
                                    render={({ field }) => (
                                        <FormItem className="flex items-center justify-between p-3 rounded-lg border bg-card">
                                            <div className="space-y-0.5">
                                                <FormLabel className="text-sm font-medium cursor-pointer">
                                                    Allow Multiple
                                                </FormLabel>
                                                <FormDescription>
                                                    Users can select multiple related entries
                                                </FormDescription>
                                            </div>
                                            <FormControl>
                                                <Switch
                                                    checked={field.value}
                                                    onCheckedChange={field.onChange}
                                                />
                                            </FormControl>
                                        </FormItem>
                                    )}
                                />
                            </div>
                        </div>
                    </>
                )}

                {/* Nested Schema Configuration */}
                {fieldType.type === "nested_schema" && (
                    <>
                        <Separator />
                        <div className="space-y-4">
                            <div className="flex items-center justify-between">
                                <h4 className="text-sm font-semibold">Nested Fields</h4>
                                <Button
                                    type="button"
                                    variant="outline"
                                    size="sm"
                                    onClick={() => {
                                        setEditingNestedField(undefined)
                                        setNestedFieldEditorOpen(true)
                                    }}
                                    className="gap-2"
                                >
                                    <Plus className="h-3 w-3" />
                                    Add Field
                                </Button>
                            </div>

                            {nestedFields.length === 0 ? (
                                <div className="flex items-center justify-center p-8 border-2 border-dashed rounded-lg">
                                    <div className="text-center">
                                        <p className="text-sm text-muted-foreground mb-2">
                                            No nested fields added yet
                                        </p>
                                        <Button
                                            type="button"
                                            variant="ghost"
                                            size="sm"
                                            onClick={() => {
                                                setEditingNestedField(undefined)
                                                setNestedFieldEditorOpen(true)
                                            }}
                                        >
                                            Add your first field
                                        </Button>
                                    </div>
                                </div>
                            ) : (
                                <div className="space-y-2">
                                    {nestedFields.map((field) => {
                                        const fieldConfig = getFieldTypeConfig(field.type)
                                        const FieldIcon = fieldConfig?.icon
                                        return (
                                        <div
                                            key={field.id}
                                            className="flex items-center justify-between p-3 border rounded-lg bg-card hover:bg-accent/50 transition-colors"
                                        >
                                            <div className="flex items-center gap-3 flex-1">
                                                {FieldIcon && (
                                                    <div className={cn(
                                                        "h-8 w-8 rounded-md flex items-center justify-center shrink-0",
                                                        fieldConfig?.displayColor || "text-gray-600 bg-gray-50"
                                                    )}>
                                                        <FieldIcon className="h-4 w-4" />
                                                    </div>
                                                )}
                                                <div className="flex-1">
                                                    <div className="flex items-center gap-2">
                                                        <span className="font-medium text-sm">{field.label}</span>
                                                        <span className="text-xs text-muted-foreground font-mono">({field.key})</span>
                                                        {field.required && (
                                                            <span className="text-xs text-destructive">*</span>
                                                        )}
                                                    </div>
                                                    <p className="text-xs text-muted-foreground">{fieldConfig?.label || field.type}</p>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-1">
                                                <Button
                                                    type="button"
                                                    variant="ghost"
                                                    size="sm"
                                                    onClick={() => {
                                                        setEditingNestedField(field)
                                                        setNestedFieldEditorOpen(true)
                                                    }}
                                                >
                                                    Edit
                                                </Button>
                                                <Button
                                                    type="button"
                                                    variant="ghost"
                                                    size="icon"
                                                    onClick={() => {
                                                        setNestedFields(nestedFields.filter(f => f.id !== field.id))
                                                    }}
                                                >
                                                    <X className="h-4 w-4" />
                                                </Button>
                                            </div>
                                        </div>
                                    )})}
                                </div>
                            )}

                            <div className="flex items-center justify-between p-3 rounded-lg border bg-card">
                                <div className="space-y-0.5">
                                    <Label className="text-sm font-medium cursor-pointer">
                                        Allow Multiple
                                    </Label>
                                    <p className="text-sm text-muted-foreground">
                                        Store as an array of objects
                                    </p>
                                </div>
                                <Switch
                                    checked={isMultipleNested}
                                    onCheckedChange={setIsMultipleNested}
                                />
                            </div>
                        </div>
                    </>
                )}

                {/* Dropdown Options */}
                {fieldType.type === "dropdown" && !form.watch("readonly") && (
                    <>
                        <Separator />
                        <div className="space-y-4">
                            <div className="flex items-center justify-between">
                                <h4 className="text-sm font-semibold">Dropdown Options</h4>
                                <Button
                                    type="button"
                                    variant="outline"
                                    size="sm"
                                    onClick={addDropdownOption}
                                    className="gap-2"
                                >
                                    <Plus className="h-3 w-3" />
                                    Add Option
                                </Button>
                            </div>

                            <div className="space-y-2">
                                {dropdownOptions.map((option, index) => (
                                    <div key={index} className="flex items-center gap-2">
                                        <Input
                                            value={option}
                                            onChange={(e) => updateDropdownOption(index, e.target.value)}
                                            placeholder={`Option ${index + 1}`}
                                            className="flex-1"
                                        />
                                        {dropdownOptions.length > 1 && (
                                            <Button
                                                type="button"
                                                variant="ghost"
                                                size="icon"
                                                onClick={() => removeDropdownOption(index)}
                                            >
                                                <X className="h-4 w-4" />
                                            </Button>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>
                    </>
                )}

                {/* Default Value */}
                {fieldType.type !== "file" && fieldType.type !== "relationship" && (
                    <>
                        <Separator />
                        <FormField
                            control={form.control}
                            name="defaultValue"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Default Value</FormLabel>
                                    <FormControl>
                                        {fieldType.type === "boolean" ? (
                                            <div className="flex items-center space-x-2">
                                                <Switch
                                                    checked={field.value === "true"}
                                                    onCheckedChange={(checked) => field.onChange(checked.toString())}
                                                />
                                                <span className="text-sm text-muted-foreground">
                                                    {field.value === "true" 
                                                        ? form.watch("booleanTrueLabel") || "True"
                                                        : form.watch("booleanFalseLabel") || "False"}
                                                </span>
                                            </div>
                                        ) : fieldType.type === "dropdown" ? (
                                            <select
                                                value={field.value}
                                                onChange={field.onChange}
                                                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                                            >
                                                <option value="">No default</option>
                                                {dropdownOptions
                                                    .filter(opt => typeof opt === 'string' && opt.trim())
                                                    .map((option, index) => (
                                                        <option key={index} value={option}>
                                                            {option}
                                                        </option>
                                                    ))}
                                            </select>
                                        ) : fieldType.type === "date" ? (
                                            <Input
                                                type="date"
                                                placeholder="Optional default date"
                                                {...field}
                                            />
                                        ) : fieldType.type === "timestamp" ? (
                                            <Input
                                                type="datetime-local"
                                                placeholder="Optional default timestamp"
                                                {...field}
                                            />
                                        ) : fieldType.type === "time" ? (
                                            <Input
                                                type="time"
                                                placeholder="Optional default time"
                                                {...field}
                                            />
                                        ) : fieldType.type === "long_text" ? (
                                            <Textarea
                                                placeholder="Optional default value"
                                                rows={3}
                                                {...field}
                                            />
                                        ) : (
                                            <Input
                                                placeholder="Optional default value"
                                                type={fieldType.type === "number" ? "number" : 
                                                      fieldType.type === "email" ? "email" :
                                                      fieldType.type === "url" ? "url" : "text"}
                                                {...field}
                                            />
                                        )}
                                    </FormControl>
                                    <FormDescription>
                                        Pre-filled value for new entries
                                    </FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </>
                )}

                {/* Form Actions */}
                <div className="flex items-center gap-3 pt-4 border-t">
                    <Button
                        type="button"
                        variant="outline"
                        onClick={onCancel}
                        className="flex-1"
                    >
                        Cancel
                    </Button>
                    <Button
                        type="submit"
                        className="flex-1"
                    >
                        {initialData ? "Update Field" : "Add Field"}
                    </Button>
                </div>
            </form>

            {/* Collection Selector Dialog */}
            {fieldType.type === "relationship" && projectId && (
                <CollectionSelectorDialog
                    open={collectionSelectorOpen}
                    onOpenChange={setCollectionSelectorOpen}
                    projectId={projectId}
                    isMultiple={false}
                    selectedIds={form.watch("relatedCollectionId") ? [form.watch("relatedCollectionId")!] : []}
                    onSelect={(ids) => {
                        if (ids.length > 0) {
                            form.setValue("relatedCollectionId", ids[0])
                        }
                    }}
                />
            )}

            {/* Nested Field Editor Dialog */}
            {fieldType.type === "nested_schema" && (
                <FieldEditorDialog
                    open={nestedFieldEditorOpen}
                    onOpenChange={setNestedFieldEditorOpen}
                    initialData={editingNestedField}
                    existingFields={nestedFields}
                    excludeTypes={["nested_schema", "relationship"]}
                    onSave={(field) => {
                        if (editingNestedField) {
                            setNestedFields(nestedFields.map(f => 
                                f.id === editingNestedField.id ? { ...field, id: f.id } : f
                            ))
                        } else {
                            setNestedFields([...nestedFields, { ...field, id: `nested_${Date.now()}` }])
                        }
                        setNestedFieldEditorOpen(false)
                        setEditingNestedField(undefined)
                    }}
                />
            )}
        </Form>
    )
}
