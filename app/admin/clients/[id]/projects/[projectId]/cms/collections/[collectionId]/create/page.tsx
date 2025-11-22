"use client"

import { useParams, useRouter } from "next/navigation"
import { useCMSCollection } from "@/lib/contexts/cms-collection-context"
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
    const { cmsCollectionData, isLoading, error } = useCMSCollection()
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [createdEntry, setCreatedEntry] = useState<CMSEntry | null>(null)

    const clientId = params.id as string
    const projectId = params.projectId as string
    const collectionId = params.collectionId as string

    const processRelationshipFields = (data: Record<string, any>, fields: any[]) => {
        const processed = { ...data }
        
        for (const field of fields) {
            const fieldKey = field.fieldConfig?.key
            const fieldType = field.fieldConfig?.type
            
            if (fieldType === 'relationship' && fieldKey && processed[fieldKey]) {
                const value = processed[fieldKey]
                
                // Extract IDs from populated relationship objects
                if (Array.isArray(value)) {
                    // Multiple relationships
                    processed[fieldKey] = value.map(item => 
                        typeof item === 'object' && item !== null ? item.id : item
                    )
                } else if (typeof value === 'object' && value !== null) {
                    // Single relationship
                    processed[fieldKey] = value.id
                }
            }
        }
        
        return processed
    }

    const processFileFields = async (data: Record<string, any>, fields: any[]) => {
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
        }
        
        return processed
    }

    const handleSave = async (data: Record<string, any>) => {
        try {
            setIsSubmitting(true)
            // First extract IDs from relationship fields
            let processedData = processRelationshipFields(data, cmsCollectionData.fields)
            // Then process file uploads
            processedData = await processFileFields(processedData, cmsCollectionData.fields)

            if (createdEntry) {
                const updated = await cmsApi.entries.saveDraft(projectId, collectionId, createdEntry.id, processedData)
                toast.success("Saved successfully")
                setCreatedEntry(updated)
                return updated
            } else {
                const entry = await cmsApi.entries.create(projectId, collectionId, {
                    data: processedData,
                    published: false,
                })
                toast.success("Entry created")
                setCreatedEntry(entry)
                queryClient.invalidateQueries({ queryKey: ["cms-entries", projectId, collectionId] })
                return entry
            }
        } catch (error: any) {
            console.error("Failed to save:", error)
            const errorMessage = error?.response?.data?.message || error?.message || "Failed to save. Please try again."
            toast.error(errorMessage)
            throw error
        } finally {
            setIsSubmitting(false)
        }
    }

    const handlePublish = async () => {
        if (!createdEntry) return null as unknown as CMSEntry

        try {
            setIsSubmitting(true)
            const published = await cmsApi.entries.publish(projectId, collectionId, createdEntry.id)
            toast.success("Entry published successfully")
            setCreatedEntry(published)
            return published
        } catch (error: any) {
            console.error("Failed to publish:", error)
            const errorMessage = error?.response?.data?.message || error?.message || "Failed to publish entry. Please try again."
            toast.error(errorMessage)
            throw error
        } finally {
            setIsSubmitting(false)
        }
    }

    const handleUnpublish = async () => {
        if (!createdEntry) return null as unknown as CMSEntry

        try {
            setIsSubmitting(true)
            const unpublished = await cmsApi.entries.unpublish(projectId, collectionId, createdEntry.id)
            toast.success("Entry unpublished")
            setCreatedEntry(unpublished)
            return unpublished
        } catch (error: any) {
            console.error("Failed to unpublish:", error)
            const errorMessage = error?.response?.data?.message || error?.message || "Failed to unpublish entry."
            toast.error(errorMessage)
            throw error
        } finally {
            setIsSubmitting(false)
        }
    }

    const handleBack = () => {
        router.push(`/admin/clients/${clientId}/projects/${projectId}/cms/collections/${collectionId}`)
    }

    if (isLoading) {
        return <EntryFormLoading />
    }

    if (error || !cmsCollectionData.collection) {
        return (
            <div className="py-12">
                <SectionPlaceholder
                    variant="error"
                    icon={AlertCircle}
                    title="Failed to load collection"
                    description={error?.message || "Unable to load collection details. Please try again."}
                />
            </div>
        )
    }

    const transformedData = createdEntry ? transformEntryDataForForm(createdEntry.dataDraft || createdEntry.data, cmsCollectionData.fields) : {}

    return (
        <CollectionEntryForm
            collection={cmsCollectionData.collection}
            fields={cmsCollectionData.fields}
            onSave={handleSave}
            onPublish={handlePublish}
            onUnpublish={handleUnpublish}
            onBack={handleBack}
            initialData={transformedData}
            entry={createdEntry}
            isSubmitting={isSubmitting}
            projectId={projectId}
        />
    )
}

function transformEntryDataForForm(entryData: Record<string, any>, fields: any[]) {
    const transformed = { ...entryData }
    
    for (const field of fields) {
        const fieldKey = field.fieldConfig?.key
        const fieldType = field.fieldConfig?.type
        
        if (fieldType === 'file' && fieldKey && transformed[fieldKey]) {
            const fileValue = transformed[fieldKey]
            
            if (Array.isArray(fileValue)) {
                transformed[fieldKey] = fileValue.map((file: any, index: number) => ({
                    id: file.key || `${fieldKey}-${index}`,
                    file: null,
                    preview: file.key ? `https://fly.storage.tigris.dev/${file.key}` : undefined,
                    ...file
                }))
            } else if (typeof fileValue === 'object' && fileValue.key) {
                transformed[fieldKey] = {
                    id: fileValue.key,
                    file: null,
                    preview: `https://fly.storage.tigris.dev/${fileValue.key}`,
                    ...fileValue
                }
            }
        }
    }
    
    return transformed
}
