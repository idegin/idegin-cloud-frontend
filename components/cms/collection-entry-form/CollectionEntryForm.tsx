"use client"

import React, { useState, useCallback, useEffect, useMemo, useRef } from "react"
import { CMSCollectionFieldRenderer } from "./CMSCollectionFieldRenderer"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { AlertCircle, ArrowLeft, Save, Upload, Eye, EyeOff } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import type { CMSCollection, CMSCollectionField, CMSEntry } from "@/lib/api/cms"
import { isEqual } from "lodash"
import { useDebounce } from "@/hooks/use-debounce"

interface CollectionEntryFormProps {
    collection: CMSCollection
    fields: CMSCollectionField[]
    onSave?: (data: Record<string, any>) => Promise<CMSEntry>
    onPublish?: () => Promise<CMSEntry>
    onUnpublish?: () => Promise<CMSEntry>
    onBack?: () => void
    initialData?: Record<string, any>
    entry?: CMSEntry | null
    isSubmitting?: boolean
    projectId?: string
}

export function CollectionEntryForm({
    collection,
    fields,
    onSave,
    onPublish,
    onUnpublish,
    onBack,
    initialData = {},
    entry = null,
    isSubmitting = false,
    projectId,
}: CollectionEntryFormProps) {
    const [formData, setFormData] = useState<Record<string, any>>(initialData)
    const [errors, setErrors] = useState<Record<string, string>>({})
    const [generalError, setGeneralError] = useState<string>("")
    const [currentEntry, setCurrentEntry] = useState<CMSEntry | null>(entry)
    const [savedFormData, setSavedFormData] = useState<Record<string, any>>(initialData)
    const [isInitialized, setIsInitialized] = useState(false)

    const onChangeCallbacks = React.useRef<Record<string, (value: any) => void>>({})

    useEffect(() => {
        if (!isInitialized) {
            setFormData(initialData)
            setSavedFormData(initialData)
            setIsInitialized(true)
        }
    }, [initialData, isInitialized])

    useEffect(() => {
        setCurrentEntry(entry)
    }, [entry])

    const sortedFields = useMemo(() => {
        return [...fields].sort((a, b) => {
            const orderA = parseInt(a.indexOrder) || 0
            const orderB = parseInt(b.indexOrder) || 0
            return orderA - orderB
        })
    }, [fields])

    const formDataRef = useRef(formData)
    
    useEffect(() => {
        formDataRef.current = formData
    }, [formData])

    const getFormData = useCallback(() => formDataRef.current, [])

    const handleFieldChange = useCallback((fieldKey: string, value: any) => {
        setFormData(prev => ({
            ...prev,
            [fieldKey]: value,
        }))
        
        setErrors(prev => {
            if (prev[fieldKey]) {
                const newErrors = { ...prev }
                delete newErrors[fieldKey]
                return newErrors
            }
            return prev
        })
    }, [])

    const getFieldChangeHandler = useCallback((fieldKey: string) => {
        if (!onChangeCallbacks.current[fieldKey]) {
            onChangeCallbacks.current[fieldKey] = (value: any) => {
                setFormData(prev => ({
                    ...prev,
                    [fieldKey]: value,
                }))
                
                setErrors(prev => {
                    if (prev[fieldKey]) {
                        const newErrors = { ...prev }
                        delete newErrors[fieldKey]
                        return newErrors
                    }
                    return prev
                })
            }
        }
        return onChangeCallbacks.current[fieldKey]
    }, [])

    const validateForm = useCallback((): boolean => {
        const newErrors: Record<string, string> = {}

        sortedFields.forEach(field => {
            const { fieldConfig, validationRules } = field
            const fieldKey = fieldConfig.key
            const value = formData[fieldKey]

            if (validationRules?.required && !value && value !== 0 && value !== false) {
                newErrors[fieldKey] = `${fieldConfig.label} is required`
                return
            }

            if (value) {
                if (fieldConfig.type === "number") {
                    const numValue = Number(value)
                    if (validationRules?.min !== undefined && numValue < validationRules.min) {
                        newErrors[fieldKey] = `${fieldConfig.label} must be at least ${validationRules.min}`
                    }
                    if (validationRules?.max !== undefined && numValue > validationRules.max) {
                        newErrors[fieldKey] = `${fieldConfig.label} must be at most ${validationRules.max}`
                    }
                }

                if (typeof value === "string") {
                    if (validationRules?.minLength && value.length < validationRules.minLength) {
                        newErrors[fieldKey] = `${fieldConfig.label} must be at least ${validationRules.minLength} characters`
                    }
                    if (validationRules?.maxLength && value.length > validationRules.maxLength) {
                        newErrors[fieldKey] = `${fieldConfig.label} must be at most ${validationRules.maxLength} characters`
                    }
                }
            }
        })

        setErrors(newErrors)
        return Object.keys(newErrors).length === 0
    }, [formData, sortedFields])

    const handleSave = async () => {
        setGeneralError("")

        if (!validateForm()) {
            setGeneralError("Please fix the errors above before saving")
            return
        }

        if (onSave) {
            try {
                const updatedEntry = await onSave(formData)
                setCurrentEntry(updatedEntry)
                setSavedFormData(formData)
            } catch (error) {
                setGeneralError(
                    error instanceof Error 
                        ? error.message 
                        : "An error occurred while saving"
                )
            }
        }
    }

    const handlePublish = async () => {
        setGeneralError("")

        if (onPublish) {
            try {
                const updatedEntry = await onPublish()
                setCurrentEntry(updatedEntry)
            } catch (error) {
                setGeneralError(
                    error instanceof Error 
                        ? error.message 
                        : "An error occurred while publishing"
                )
            }
        }
    }

    const handleUnpublish = async () => {
        setGeneralError("")

        if (onUnpublish) {
            try {
                const updatedEntry = await onUnpublish()
                setCurrentEntry(updatedEntry)
            } catch (error) {
                setGeneralError(
                    error instanceof Error 
                        ? error.message 
                        : "An error occurred while unpublishing"
                )
            }
        }
    }

    const isPublished = currentEntry?.published || false
    const hasDraft = currentEntry?.dataDraft && Object.keys(currentEntry.dataDraft).length > 0
    
    const debouncedFormData = useDebounce(formData, 300)
    
    const hasUnsavedChanges = useMemo(() => {
        return !isEqual(debouncedFormData, savedFormData)
    }, [debouncedFormData, savedFormData])

    const hasDraftChanges = useMemo(() => {
        if (!isPublished || !hasDraft) return false
        return !isEqual(currentEntry?.data || {}, currentEntry?.dataDraft || {})
    }, [isPublished, hasDraft, currentEntry])

    const canPublish = hasDraft && !hasUnsavedChanges
    const canPublishChanges = isPublished && hasDraftChanges && !hasUnsavedChanges

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-start justify-between gap-4">
                <div className="flex items-center gap-3">
                    {onBack && (
                        <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            onClick={onBack}
                            disabled={isSubmitting}
                            className="h-9 w-9"
                        >
                            <ArrowLeft className="h-4 w-4" />
                        </Button>
                    )}
                    <div>
                        <div className="flex items-center gap-3">
                            <h2 className="text-2xl font-semibold tracking-tight">
                                {currentEntry ? "Edit Entry" : "Create New Entry"}
                            </h2>
                            {currentEntry && (
                                <div className="flex items-center gap-2">
                                    {isPublished && !hasDraftChanges && (
                                        <Badge variant="default" className="gap-1 bg-green-500 hover:bg-green-600">
                                            <Eye className="h-3 w-3" />
                                            Published
                                        </Badge>
                                    )}
                                    {isPublished && hasDraftChanges && (
                                        <Badge variant="default" className="gap-1 bg-orange-500 hover:bg-orange-600">
                                            <Eye className="h-3 w-3" />
                                            Published (Pending Changes)
                                        </Badge>
                                    )}
                                    {!isPublished && (
                                        <Badge variant="secondary" className="gap-1 bg-amber-500 hover:bg-amber-600 text-white">
                                            <EyeOff className="h-3 w-3" />
                                            Draft
                                        </Badge>
                                    )}
                                    {hasUnsavedChanges && (
                                        <Badge variant="outline">
                                            Unsaved Changes
                                        </Badge>
                                    )}
                                </div>
                            )}
                        </div>
                        {collection.description && (
                            <p className="text-sm text-muted-foreground mt-1">
                                {collection.description}
                            </p>
                        )}
                    </div>
                </div>

                {/* Action Buttons */}
                <div className="flex items-center gap-2">
                    {!isPublished ? (
                        <>
                            <Button
                                type="button"
                                variant="outline"
                                onClick={handleSave}
                                disabled={isSubmitting || sortedFields.length === 0 || !hasUnsavedChanges}
                                className="gap-2"
                            >
                                <Save className="h-4 w-4" />
                                Save
                            </Button>
                            <Button
                                type="button"
                                variant="default"
                                onClick={handlePublish}
                                disabled={isSubmitting || !canPublish}
                                className="gap-2"
                            >
                                <Upload className="h-4 w-4" />
                                Publish
                            </Button>
                        </>
                    ) : hasDraftChanges ? (
                        <>
                            {hasUnsavedChanges && (
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={handleSave}
                                    disabled={isSubmitting || sortedFields.length === 0}
                                    className="gap-2"
                                >
                                    <Save className="h-4 w-4" />
                                    Save
                                </Button>
                            )}
                            <Button
                                type="button"
                                variant="default"
                                onClick={handlePublish}
                                disabled={isSubmitting || hasUnsavedChanges}
                                className="gap-2"
                            >
                                <Upload className="h-4 w-4" />
                                Publish Changes
                            </Button>
                        </>
                    ) : (
                        <>
                            {hasUnsavedChanges && (
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={handleSave}
                                    disabled={isSubmitting || sortedFields.length === 0}
                                    className="gap-2"
                                >
                                    <Save className="h-4 w-4" />
                                    Save
                                </Button>
                            )}
                            <Button
                                type="button"
                                variant="secondary"
                                onClick={handleUnpublish}
                                disabled={isSubmitting}
                                className="gap-2"
                            >
                                <EyeOff className="h-4 w-4" />
                                Unpublish
                            </Button>
                        </>
                    )}
                </div>
            </div>

            <Separator />

            {/* Form */}
            <div className="space-y-6">
                {generalError && (
                    <Alert variant="destructive">
                        <AlertCircle className="h-4 w-4" />
                        <AlertDescription>{generalError}</AlertDescription>
                    </Alert>
                )}

                {sortedFields.length === 0 ? (
                    <Alert>
                        <AlertCircle className="h-4 w-4" />
                        <AlertDescription>
                            No fields have been configured for this collection yet.
                            Please add fields to the collection schema first.
                        </AlertDescription>
                    </Alert>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {sortedFields.map((field) => {
                            const fieldType = field.fieldConfig?.type?.toLowerCase() || "short_text"
                            const isFullWidth = fieldType === "rich_text" || 
                                              fieldType === "long_text" ||
                                              fieldType === "file" ||
                                              fieldType === "json"
                            
                            return (
                                <div 
                                    key={field.id}
                                    className={isFullWidth ? "md:col-span-2" : ""}
                                >
                                    <CMSCollectionFieldRenderer
                                        field={field}
                                        value={formData[field.fieldConfig.key]}
                                        onChange={getFieldChangeHandler(field.fieldConfig.key)}
                                        error={errors[field.fieldConfig.key]}
                                        projectId={projectId}
                                        getFormData={getFormData}
                                        onFieldChange={handleFieldChange}
                                    />
                                </div>
                            )
                        })}
                    </div>
                )}
            </div>
        </div>
    )
}
