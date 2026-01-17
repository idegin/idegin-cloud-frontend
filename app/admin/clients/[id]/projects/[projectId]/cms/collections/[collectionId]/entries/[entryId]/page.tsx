"use client"

import { useParams, useRouter } from "next/navigation"
import { useCMSCollection } from "@/lib/contexts/cms-collection-context"
import { useProject } from "@/lib/contexts/project-context"
import { useCMSEntry } from "@/lib/hooks/cms"
import { CollectionEntryForm } from "@/components/cms/collection-entry-form"
import { EntryFormLoading } from "@/components/cms/entry-form-loading"
import { cmsApi, type CMSEntry } from "@/lib/api/cms"
import { useState, useEffect } from "react"
import { toast } from "sonner"
import { AlertCircle } from "lucide-react"
import { SectionPlaceholder } from "@/components/shared/section-placeholder"
import { useQueryClient } from "@tanstack/react-query"

export default function EntryDetailsPage() {
    const params = useParams()
    const router = useRouter()
    const queryClient = useQueryClient()
    const { cmsCollectionData, isLoading: isCollectionLoading, error: collectionError } = useCMSCollection()
    const { project, isLoading: isProjectLoading } = useProject()
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [currentEntry, setCurrentEntry] = useState<CMSEntry | null>(null)
    const [transformedData, setTransformedData] = useState<Record<string, any> | null>(null)

    const clientId = params.id as string
    const projectId = params.projectId as string
    const collectionId = params.collectionId as string
    const entryId = params.entryId as string

    const { data: entry, isPending: isEntryLoading, error: entryError } = useCMSEntry(
        projectId,
        collectionId,
        entryId
    )

    useEffect(() => {
        if (currentEntry && cmsCollectionData.fields) {
            transformEntryDataForForm(currentEntry?.dataDraft || currentEntry?.data || {}, cmsCollectionData.fields)
                .then(setTransformedData)
                .catch(error => {
                    console.error('Failed to transform entry data:', error)
                    setTransformedData(currentEntry?.dataDraft || currentEntry?.data || {})
                })
        }
    }, [currentEntry, cmsCollectionData.fields])

    if (entry && !currentEntry) {
        setCurrentEntry(entry)
    }

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

    const processNestedSchemaFields = (data: Record<string, any>, fields: any[]) => {
        const processed = { ...data }
        
        for (const field of fields) {
            const fieldKey = field.fieldConfig?.key
            const fieldType = field.fieldConfig?.type
            
            if (fieldType === 'nested_schema' && fieldKey && processed[fieldKey]) {
                const value = processed[fieldKey]
                const nestedFields = field.configOptions?.nestedSchemaConfig?.fields || []
                
                // Recursively process nested relationship fields
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

    const transformEntryDataForForm = async (entryData: Record<string, any>, fields: any[]): Promise<Record<string, any>> => {
        const transformed = { ...entryData }
        
        for (const field of fields) {
            const fieldKey = field.fieldConfig?.key
            const fieldType = field.fieldConfig?.type
            
            if (fieldType === 'file' && fieldKey && transformed[fieldKey]) {
                const fileValue = transformed[fieldKey]
                
                if (Array.isArray(fileValue)) {
                    const transformedFiles = await Promise.all(
                        fileValue.map(async (file: any, index: number) => {
                            let preview: string | undefined = file.url || file.downloadURL || undefined
                            
                            if (!preview && file.key) {
                                try {
                                    preview = await cmsApi.files.getFileUrl(projectId, file.key)
                                } catch (error) {
                                    console.error(`Failed to get signed URL for ${file.key}:`, error)
                                }
                            }
                            
                            return {
                                id: file.key || `${fieldKey}-${index}`,
                                file: null,
                                preview,
                                ...file
                            }
                        })
                    )
                    transformed[fieldKey] = transformedFiles
                } else if (typeof fileValue === 'object' && fileValue.key) {
                    let preview: string | undefined = fileValue.url || fileValue.downloadURL || undefined
                    
                    if (!preview) {
                        try {
                            preview = await cmsApi.files.getFileUrl(projectId, fileValue.key)
                        } catch (error) {
                            console.error(`Failed to get signed URL for ${fileValue.key}:`, error)
                        }
                    }
                    
                    transformed[fieldKey] = {
                        id: fileValue.key,
                        file: null,
                        preview,
                        ...fileValue
                    }
                }
            }
            
            // Handle files inside nested_schema fields
            if (fieldType === 'nested_schema' && fieldKey && transformed[fieldKey]) {
                const nestedValue = transformed[fieldKey]
                const nestedFields = field.configOptions?.nestedSchemaConfig?.fields || []
                
                const nestedFieldConfigs = nestedFields.map((nf: any) => ({
                    fieldConfig: {
                        key: nf.key,
                        type: nf.type,
                        label: nf.label,
                    },
                    configOptions: nf.configOptions || {},
                }))
                
                if (Array.isArray(nestedValue)) {
                    const transformedItems = await Promise.all(
                        nestedValue.map(item => transformEntryDataForForm(item, nestedFieldConfigs))
                    )
                    transformed[fieldKey] = transformedItems
                } else if (typeof nestedValue === 'object' && nestedValue !== null) {
                    transformed[fieldKey] = await transformEntryDataForForm(nestedValue, nestedFieldConfigs)
                }
            }
        }
        
        return transformed
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
            // First extract IDs from relationship fields (including nested ones)
            let processedData = processRelationshipFields(data, cmsCollectionData.fields)
            // Process nested schema fields
            processedData = processNestedSchemaFields(processedData, cmsCollectionData.fields)
            // Then process file uploads
            processedData = await processFileFields(processedData, cmsCollectionData.fields)
            const updated = await cmsApi.entries.saveDraft(projectId, collectionId, entryId, processedData)
            toast.success("Saved successfully")
            setCurrentEntry(updated)
            queryClient.setQueryData(["cms-entry", projectId, collectionId, entryId], updated)
            queryClient.invalidateQueries({ queryKey: ["cms-entries", projectId, collectionId] })
            return updated
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
        try {
            setIsSubmitting(true)
            const published = await cmsApi.entries.publish(projectId, collectionId, entryId)
            toast.success("Entry published successfully")
            setCurrentEntry(published)
            queryClient.setQueryData(["cms-entry", projectId, collectionId, entryId], published)
            queryClient.invalidateQueries({ queryKey: ["cms-entries", projectId, collectionId] })
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
        if (!currentEntry) return null as unknown as CMSEntry

        try {
            setIsSubmitting(true)
            const unpublished = await cmsApi.entries.unpublish(projectId, collectionId, entryId)
            toast.success("Entry unpublished")
            setCurrentEntry(unpublished)
            queryClient.setQueryData(["cms-entry", projectId, collectionId, entryId], unpublished)
            queryClient.invalidateQueries({ queryKey: ["cms-entries", projectId, collectionId] })
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

    if (isCollectionLoading || isEntryLoading || isProjectLoading) {
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

    if (entryError || !entry) {
        return (
            <div className="py-12">
                <SectionPlaceholder
                    variant="error"
                    icon={AlertCircle}
                    title="Failed to load entry"
                    description={entryError?.message || "Unable to load entry details. Please try again."}
                    action={{
                        label: "Back to Entries",
                        onClick: () => router.push(`/admin/clients/${clientId}/projects/${projectId}/cms/collections/${collectionId}`),
                        variant: "default"
                    }}
                />
            </div>
        )
    }

    if (!transformedData) {
        return <EntryFormLoading />
    }

    const breadcrumbs = project ? [
        { label: "Clients", href: "/admin/clients" },
        { label: project.project.projectName, href: `/admin/clients/${clientId}/projects/${projectId}` },
        { label: "CMS", href: `/admin/clients/${clientId}/projects/${projectId}/cms` },
        { label: cmsCollectionData.collection.name, href: `/admin/clients/${clientId}/projects/${projectId}/cms/collections/${collectionId}` },
        { label: currentEntry?.data?.name || currentEntry?.data?.title || "Edit Entry" },
    ] : []

    return (
        <CollectionEntryForm
            collection={cmsCollectionData.collection}
            fields={cmsCollectionData.fields}
            onSave={handleSave}
            onPublish={handlePublish}
            onUnpublish={handleUnpublish}
            onBack={handleBack}
            initialData={transformedData}
            entry={currentEntry}
            isSubmitting={isSubmitting}
            projectId={projectId}
            breadcrumbs={breadcrumbs}
        />
    )
}
