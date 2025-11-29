"use client"

import { useMemo } from "react"
import { useParams, useRouter } from "next/navigation"
import { SchemaManager, type SchemaField } from "@/components/cms/schema-manager/SchemaManager"
import { useCMSCollection } from "@/lib/contexts/cms-collection-context"
import { useUpdateSchema } from "@/lib/hooks/cms"
import { SectionPlaceholder } from "@/components/shared/section-placeholder"
import { Database, Loader2 } from "lucide-react"
import { toast } from "@/hooks/use-toast"

interface OriginalField {
    id: string
    indexOrder: string
    fieldConfig: any
    validationRules?: any
    configOptions?: any
    dropdownOptions?: any
}

export default function EditFieldsPage() {
    const params = useParams()
    const router = useRouter()
    const projectId = params.projectId as string
    const collectionId = params.collectionId as string
    const clientId = params.id as string

    const { cmsCollectionData, isLoading, error, refetch } = useCMSCollection()
    const updateSchemaMutation = useUpdateSchema(projectId, collectionId)

    const originalFieldsMap = useMemo(() => {
        const map = new Map<string, OriginalField>()
        if (cmsCollectionData.fields) {
            cmsCollectionData.fields.forEach((field) => {
                map.set(field.id, {
                    id: field.id,
                    indexOrder: field.indexOrder,
                    fieldConfig: field.fieldConfig,
                    validationRules: field.validationRules,
                    configOptions: field.configOptions,
                    dropdownOptions: field.dropdownOptions,
                })
            })
        }
        return map
    }, [cmsCollectionData.fields])

    const schemaFields: SchemaField[] = useMemo(() => {
        if (!cmsCollectionData.fields || cmsCollectionData.fields.length === 0) {
            return []
        }

        return cmsCollectionData.fields.map((field) => ({
            id: field.id,
            label: field.fieldConfig?.label || "",
            key: field.fieldConfig?.key || "",
            type: field.fieldConfig?.type || "string",
            required: field.validationRules?.required || false,
            readonly: field.fieldConfig?.readonly || false,
            hidden: field.fieldConfig?.hidden || false,
            helpText: field.fieldConfig?.helpText,
            placeholder: field.fieldConfig?.placeholder,
            validation: {
                minLength: field.validationRules?.minLength,
                maxLength: field.validationRules?.maxLength,
                minValue: field.validationRules?.minValue,
                maxValue: field.validationRules?.maxValue,
                pattern: field.validationRules?.pattern,
            },
            dropdownOptions: (() => {
                const options = field.dropdownOptions || field.configOptions?.dropdownOptions
                if (Array.isArray(options)) {
                    return options
                        .map(opt => typeof opt === 'string' ? opt : String(opt))
                        .filter(opt => opt.trim())
                }
                return undefined
            })(),
            defaultValue: field.defaultStringValue || field.configOptions?.defaultValue,
            nestedSchemaConfig: field.configOptions?.nestedSchemaConfig,
            relationshipConfig: field.configOptions?.relationshipConfig,
            fileConfig: field.configOptions?.fileConfig,
            dateConfig: field.configOptions?.dateConfig,
            booleanConfig: field.configOptions?.booleanConfig,
        }))
    }, [cmsCollectionData.fields])

    const handleSaveFields = async (fields: SchemaField[]) => {
        const toCreate: any[] = []
        const toUpdate: any[] = []
        const toDelete: any[] = []

        const currentFieldIds = new Set(fields.map(f => f.id))
        
        fields.forEach((field, index) => {
            const isNewField = field.id.startsWith('field_')
            
            const fieldConfig = {
                label: field.label,
                key: field.key,
                type: field.type,
                placeholder: field.placeholder,
                helpText: field.helpText,
                readonly: field.readonly,
                hidden: field.hidden,
            }

            const validationRules = {
                required: field.required,
                ...(field.validation?.minLength !== undefined && { minLength: field.validation.minLength }),
                ...(field.validation?.maxLength !== undefined && { maxLength: field.validation.maxLength }),
                ...(field.validation?.minValue !== undefined && { minValue: field.validation.minValue }),
                ...(field.validation?.maxValue !== undefined && { maxValue: field.validation.maxValue }),
                ...(field.validation?.step !== undefined && { step: field.validation.step }),
                ...(field.validation?.pattern && { pattern: field.validation.pattern }),
            }

            const configOptions: any = {}
            
            if (field.dropdownOptions) {
                configOptions.dropdownOptions = field.dropdownOptions
            }
            
            if (field.fileConfig) {
                configOptions.fileConfig = field.fileConfig
            }
            
            if (field.dateConfig) {
                configOptions.dateConfig = field.dateConfig
            }
            
            if (field.booleanConfig) {
                configOptions.booleanConfig = field.booleanConfig
            }
            
            if (field.relationshipConfig) {
                configOptions.relationshipConfig = field.relationshipConfig
            }
            
            if (field.nestedSchemaConfig) {
                configOptions.nestedSchemaConfig = field.nestedSchemaConfig
            }

            const fieldData: any = {
                indexOrder: String(index),
                fieldConfig,
                validationRules,
                ...(Object.keys(configOptions).length > 0 && { configOptions }),
                ...(field.dropdownOptions && { dropdownOptions: field.dropdownOptions }),
                ...(field.defaultValue && { defaultValue: field.defaultValue }),
                ...(field.relationshipConfig?.relatedCollectionId && { 
                    relatedCollectionId: field.relationshipConfig.relatedCollectionId 
                }),
            }

            if (isNewField) {
                toCreate.push(fieldData)
            } else {
                const originalField = originalFieldsMap.get(field.id)
                if (originalField && !field.readonly) {
                    const hasChanged = 
                        JSON.stringify(fieldConfig) !== JSON.stringify(originalField.fieldConfig) ||
                        JSON.stringify(validationRules) !== JSON.stringify(originalField.validationRules) ||
                        String(index) !== originalField.indexOrder ||
                        JSON.stringify(configOptions) !== JSON.stringify(originalField.configOptions || {}) ||
                        JSON.stringify(field.dropdownOptions || []) !== JSON.stringify(originalField.dropdownOptions || [])

                    if (hasChanged) {
                        toUpdate.push({
                            id: field.id,
                            ...fieldData
                        })
                    }
                }
            }
        })

        originalFieldsMap.forEach((originalField, fieldId) => {
            if (!currentFieldIds.has(fieldId)) {
                toDelete.push({ id: fieldId })
            }
        })

        try {
            await updateSchemaMutation.mutateAsync({
                ...(toCreate.length > 0 && { toCreate }),
                ...(toUpdate.length > 0 && { toUpdate }),
                ...(toDelete.length > 0 && { toDelete }),
            })

            // Only refetch on success
            await refetch()

            toast({
                title: "Schema updated",
                description: "Your field changes have been saved successfully.",
            })
        } catch (error: any) {
            console.error("Error saving schema:", error)
            
            // Extract error message from response
            const errorMessage = error?.response?.data?.message 
                || error?.message 
                || "An error occurred while saving the schema."
            
            toast({
                title: "Failed to save changes",
                description: errorMessage,
                variant: "destructive",
            })
            
            // Re-throw to prevent SchemaManager from resetting state
            throw error
        }
    }

    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-[400px]">
                <div className="flex flex-col items-center gap-4">
                    <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                    <p className="text-sm text-muted-foreground">Loading schema...</p>
                </div>
            </div>
        )
    }

    if (error) {
        return (
            <div className="py-12">
                <SectionPlaceholder
                    variant="error"
                    icon={Database}
                    title="Failed to load schema"
                    description="There was an error loading the collection schema. Please try again."
                />
            </div>
        )
    }

    return (
        <SchemaManager
            initialFields={schemaFields}
            onSave={handleSaveFields}
            collectionName={cmsCollectionData.collection?.name}
            onBack={() => router.push(`/admin/clients/${clientId}/projects/${projectId}/cms/collections/${collectionId}`)}
        />
    )
}
