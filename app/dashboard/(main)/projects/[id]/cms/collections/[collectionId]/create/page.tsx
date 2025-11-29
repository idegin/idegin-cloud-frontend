"use client"

import { useParams, useRouter } from "next/navigation"
import { useCMSCollection } from "@/lib/contexts/cms-collection-context"
import { useProject } from "@/lib/contexts/project-context"
import { CollectionEntryForm } from "@/components/cms/collection-entry-form"
import { EntryFormLoading } from "@/components/cms/entry-form-loading"
import { cmsApi, type CMSEntry } from "@/lib/api/cms"
import { useState } from "react"
import { toast } from "sonner"
import { AlertCircle } from "lucide-react"
import { SectionPlaceholder } from "@/components/shared/section-placeholder"
import { useQueryClient } from "@tanstack/react-query"

export default function CreateEntryPage() {
    const params = useParams()
    const router = useRouter()
    const queryClient = useQueryClient()
    const { cmsCollectionData, isLoading: isCollectionLoading, error: collectionError } = useCMSCollection()
    const { project, isLoading: isProjectLoading } = useProject()
    const [isSubmitting, setIsSubmitting] = useState(false)

    const projectId = params.id as string
    const collectionId = params.collectionId as string

    const processRelationshipFields = (data: Record<string, any>, fields: any[]) => {
        const processed = { ...data }
        
        for (const field of fields) {
            const fieldKey = field.fieldConfig?.key
            const fieldType = field.fieldConfig?.type
            
            if (fieldType === 'relationship' && fieldKey && processed[fieldKey]) {
                const value = processed[fieldKey]
                
                if (Array.isArray(value)) {
                    processed[fieldKey] = value.map(item => 
                        typeof item === 'object' && item !== null ? item.id : item
                    )
                } else if (typeof value === 'object' && value !== null) {
                    processed[fieldKey] = value.id
                }
            }
        }
        
        return processed
    }

    const processNestedSchemaFields = (data: Record<string, any>, fields: any[]) => {
        const processed = { ...data }
        
        for (const field of fields) {
            const fieldKey = field.fieldConfig?.key
            const fieldType = field.fieldConfig?.type
            
            if (fieldType === 'nested_schema' && fieldKey && processed[fieldKey]) {
                const value = processed[fieldKey]
                const nestedFields = field.configOptions?.nestedSchemaConfig?.fields || []
                
                if (Array.isArray(value)) {
                    processed[fieldKey] = value.map(item => 
                        processRelationshipFields(item, nestedFields)
                    )
                } else if (typeof value === 'object' && value !== null) {
                    processed[fieldKey] = processRelationshipFields(value, nestedFields)
                }
            }
        }
        
        return processed
    }

    const processFileFields = async (data: Record<string, any>, fields: any[]): Promise<Record<string, any>> => {
        const processed = { ...data }
        
        for (const field of fields) {
            const fieldKey = field.fieldConfig?.key
            const fieldType = field.fieldConfig?.type
            
            if (fieldType === 'file' && fieldKey && processed[fieldKey]) {
                const fileValue = processed[fieldKey]
                
                if (fileValue === '' || (Array.isArray(fileValue) && fileValue.length === 0)) {
                    delete processed[fieldKey]
                    continue
                }
                
                if (Array.isArray(fileValue)) {
                    const uploadedFiles = []
                    
                    for (const item of fileValue) {
                        if (item.file && item.file instanceof File) {
                            toast.info(`Uploading ${item.file.name}...`)
                            const uploadedFile = await cmsApi.files.upload(projectId, item.file)
                            uploadedFiles.push(uploadedFile)
                        } else if (item.key) {
                            uploadedFiles.push(item)
                        }
                    }
                    
                    if (uploadedFiles.length > 0) {
                        processed[fieldKey] = uploadedFiles
                    } else {
                        delete processed[fieldKey]
                    }
                } else if (fileValue.file && fileValue.file instanceof File) {
                    toast.info(`Uploading ${fileValue.file.name}...`)
                    const uploadedFile = await cmsApi.files.upload(projectId, fileValue.file)
                    processed[fieldKey] = uploadedFile
                } else if (fileValue.key) {
                    processed[fieldKey] = fileValue
                } else {
                    delete processed[fieldKey]
                }
            }
            
            // Handle nested schema fields with file fields inside
            if (fieldType === 'nested_schema' && fieldKey && processed[fieldKey]) {
                const nestedValue = processed[fieldKey]
                const nestedFields = field.configOptions?.nestedSchemaConfig?.fields || []
                
                // Build nested field configs for recursive processing
                const nestedFieldConfigs = nestedFields.map((nf: any) => ({
                    fieldConfig: nf,
                    configOptions: nf.configOptions || {},
                }))
                
                if (Array.isArray(nestedValue)) {
                    const processedItems = []
                    for (const item of nestedValue) {
                        const processedItem = await processFileFields(item, nestedFieldConfigs)
                        processedItems.push(processedItem)
                    }
                    processed[fieldKey] = processedItems
                } else if (typeof nestedValue === 'object' && nestedValue !== null) {
                    processed[fieldKey] = await processFileFields(nestedValue, nestedFieldConfigs)
                }
            }
        }
        
        return processed
    }

    const handleSave = async (data: Record<string, any>) => {
        try {
            setIsSubmitting(true)
            let processedData = processRelationshipFields(data, cmsCollectionData.fields)
            processedData = processNestedSchemaFields(processedData, cmsCollectionData.fields)
            processedData = await processFileFields(processedData, cmsCollectionData.fields)
            const created = await cmsApi.entries.create(projectId, collectionId, { data: processedData })
            toast.success("Entry created successfully")
            queryClient.invalidateQueries({ queryKey: ["cms-entries", projectId, collectionId] })
            router.push(`/dashboard/projects/${projectId}/cms/collections/${collectionId}/entries/${created.id}`)
            return created
        } catch (error: any) {
            console.error("Failed to create entry:", error)
            const errorMessage = error?.response?.data?.message || error?.message || "Failed to create entry. Please try again."
            toast.error(errorMessage)
            throw error
        } finally {
            setIsSubmitting(false)
        }
    }

    const handleBack = () => {
        router.push(`/dashboard/projects/${projectId}/cms/collections/${collectionId}`)
    }

    if (isCollectionLoading || isProjectLoading) {
        return <EntryFormLoading />
    }

    if (collectionError || !cmsCollectionData.collection) {
        return (
            <div className="py-12">
                <SectionPlaceholder
                    variant="error"
                    icon={AlertCircle}
                    title="Failed to load collection"
                    description={collectionError?.message || "Unable to load collection details. Please try again."}
                />
            </div>
        )
    }

    const breadcrumbs = project ? [
        { label: "Projects", href: "/dashboard/projects" },
        { label: project.project.projectName, href: `/dashboard/projects/${projectId}` },
        { label: "CMS", href: `/dashboard/projects/${projectId}/cms` },
        { label: cmsCollectionData.collection.name, href: `/dashboard/projects/${projectId}/cms/collections/${collectionId}` },
        { label: "Create Entry" },
    ] : []

    return (
        <CollectionEntryForm
            collection={cmsCollectionData.collection}
            fields={cmsCollectionData.fields}
            onSave={handleSave}
            onBack={handleBack}
            isSubmitting={isSubmitting}
            projectId={projectId}
            breadcrumbs={breadcrumbs}
        />
    )
}
