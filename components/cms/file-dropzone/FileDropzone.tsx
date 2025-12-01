"use client"

import React, { useCallback, useState } from "react"
import { useDropzone } from "react-dropzone"
import { Button } from "@/components/ui/button"
import { Upload, X, File, Image, Video, FileText, Music, AlertCircle, FolderOpen } from "lucide-react"
import { cn } from "@/lib/utils"
import { FileBrowser, type BrowserFile } from "@/components/cms/file-browser/FileBrowser"

export interface UploadedFile {
    id: string
    file: File
    preview?: string
}

interface FileDropzoneProps {
    value?: UploadedFile[]
    onChange?: (files: UploadedFile[]) => void
    accept?: Record<string, string[]>
    maxFiles?: number
    maxSize?: number
    disabled?: boolean
    error?: boolean
    className?: string
    enableBrowser?: boolean
    projectId: string
}

export function FileDropzone({
    value = [],
    onChange,
    accept,
    maxFiles,
    maxSize = 10 * 1024 * 1024, // 10MB default
    disabled = false,
    error = false,
    className,
    enableBrowser = true,
    projectId,
}: FileDropzoneProps) {
    const [dropError, setDropError] = useState<string | null>(null)
    const [browserOpen, setBrowserOpen] = useState(false)

    const onDrop = useCallback(
        (acceptedFiles: File[], rejectedFiles: any[]) => {
            setDropError(null)

            if (rejectedFiles.length > 0) {
                const rejection = rejectedFiles[0]
                if (rejection.errors[0]?.code === 'file-too-large') {
                    const maxSizeMB = (maxSize / (1024 * 1024)).toFixed(1)
                    setDropError(`File is too large. Maximum size is ${maxSizeMB}MB`)
                } else if (rejection.errors[0]?.code === 'file-invalid-type') {
                    setDropError('File type not allowed')
                } else if (rejection.errors[0]?.code === 'too-many-files') {
                    setDropError(`Maximum ${maxFiles} files allowed`)
                } else {
                    setDropError(rejection.errors[0]?.message || 'File rejected')
                }
                return
            }

            const newFiles: UploadedFile[] = acceptedFiles.map((file) => {
                const id = `${file.name}-${Date.now()}-${Math.random()}`
                const preview = file.type.startsWith("image/")
                    ? URL.createObjectURL(file)
                    : undefined

                return { id, file, preview }
            })

            onChange?.([...value, ...newFiles])
        },
        [value, onChange, maxSize, maxFiles]
    )

    const handleBrowserSelect = useCallback(
        (selectedFiles: BrowserFile[]) => {
            const newFiles: UploadedFile[] = selectedFiles.map((browserFile) => ({
                id: browserFile.id,
                file: null as any,
                preview: browserFile.url,
                key: browserFile.key,
                filename: browserFile.filename,
                url: browserFile.url,
                size: browserFile.size,
                contentType: browserFile.contentType,
                uploadedAt: new Date().toISOString(),
            }))

            onChange?.([...value, ...newFiles])
        },
        [value, onChange]
    )

    const openBrowser = useCallback(() => {
        setBrowserOpen(true)
    }, [])

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept,
        maxFiles: maxFiles ? maxFiles - value.length : undefined,
        maxSize,
        disabled: disabled || (maxFiles ? value.length >= maxFiles : false),
    })

    const removeFile = (id: string) => {
        const fileToRemove = value.find((f) => f.id === id)
        if (fileToRemove?.preview) {
            URL.revokeObjectURL(fileToRemove.preview)
        }
        onChange?.(value.filter((f) => f.id !== id))
    }

    const getFileIcon = (uploadedFile: UploadedFile) => {
        const fileType = uploadedFile.file?.type || (uploadedFile as any).contentType || ""
        if (fileType.startsWith("image/")) return Image
        if (fileType.startsWith("video/")) return Video
        if (fileType.startsWith("audio/")) return Music
        if (fileType.includes("pdf") || fileType.includes("document")) return FileText
        return File
    }

    const formatFileSize = (bytes: number) => {
        if (bytes === 0) return "0 Bytes"
        const k = 1024
        const sizes = ["Bytes", "KB", "MB", "GB"]
        const i = Math.floor(Math.log(bytes) / Math.log(k))
        return Math.round(bytes / Math.pow(k, i) * 100) / 100 + " " + sizes[i]
    }

    const canAddMore = !maxFiles || value.length < maxFiles

    return (
        <div className={cn("space-y-4", className)}>
            {/* File List - Show first if files exist */}
            {value.length > 0 && (
                <div className="space-y-2 grid md:grid-cols-2 grid-cols-1 gap-2">
                    {value.map((uploadedFile) => {
                        const FileIcon = getFileIcon(uploadedFile)
                        const filename = uploadedFile.file?.name || (uploadedFile as any).filename || ""
                        const isImage = /\.(jpg|jpeg|png|gif|webp|svg)$/i.test(filename)

                        return (
                            <div
                                key={uploadedFile.id}
                                className="group relative flex items-center gap-3 p-3 rounded-lg border h-full bg-card hover:bg-accent/50 transition-colors"
                            >
                                {/* File Preview/Icon */}
                                <div className="flex-shrink-0">
                                    {isImage && uploadedFile.preview ? (
                                        <img
                                            src={uploadedFile.preview}
                                            alt={uploadedFile.file?.name || (uploadedFile as any).filename || "File preview"}
                                            className="h-12 w-12 rounded object-cover"
                                        />
                                    ) : (
                                        <div className="h-12 w-12 rounded bg-muted flex items-center justify-center">
                                            <FileIcon className="h-6 w-6 text-muted-foreground" />
                                        </div>
                                    )}
                                </div>

                                {/* File Info */}
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm font-medium truncate">
                                        {uploadedFile.file?.name || (uploadedFile as any).filename || "Uploaded file"}
                                    </p>
                                    <p className="text-xs text-muted-foreground">
                                        {formatFileSize(uploadedFile.file?.size || (uploadedFile as any).size || 0)}
                                    </p>
                                </div>

                                {/* Remove Button */}
                                <Button
                                    type="button"
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => removeFile(uploadedFile.id)}
                                    className="flex-shrink-0 h-8 w-8 p-0 text-muted-foreground hover:text-destructive transition-colors"
                                >
                                    <X className="h-4 w-4" />
                                </Button>
                            </div>
                        )
                    })}
                </div>
            )}

            {/* Dropzone - Always show to allow adding more files */}
            {canAddMore && (
                <>
                    <div
                        {...getRootProps({
                            onClick: (e) => {
                                if (enableBrowser) {
                                    e.stopPropagation()
                                    openBrowser()
                                }
                            }
                        })}
                        className={cn(
                            "border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors",
                            isDragActive && "border-primary bg-primary/5",
                            !isDragActive && "border-muted-foreground/25 hover:border-muted-foreground/50",
                            disabled && "opacity-50 cursor-not-allowed",
                            error && "border-destructive"
                        )}
                    >
                        <input {...getInputProps()} />
                        <div className="flex flex-col items-center justify-center gap-3">
                            <div className="rounded-full bg-primary/10 p-3">
                                <Upload className="h-6 w-6 text-primary" />
                            </div>
                            <div className="space-y-1">
                                <p className="text-sm font-medium">
                                    {isDragActive
                                        ? "Drop files here"
                                        : value.length > 0 
                                            ? "Add more files" 
                                            : enableBrowser
                                                ? "Click to browse or drag & drop files here"
                                                : "Drag & drop files here, or click to select"}
                                </p>
                                <p className="text-xs text-muted-foreground">
                                    {maxFiles && `Maximum ${maxFiles} file${maxFiles > 1 ? 's' : ''}. `}
                                    Maximum size: {formatFileSize(maxSize)} per file
                                </p>
                            </div>
                        </div>
                    </div>
                    {dropError && (
                        <div className="flex items-center gap-2 p-3 rounded-lg bg-destructive/10 border border-destructive/20">
                            <AlertCircle className="h-4 w-4 text-destructive flex-shrink-0" />
                            <p className="text-sm text-destructive">{dropError}</p>
                        </div>
                    )}
                </>
            )}

            {/* Max files reached message */}
            {!canAddMore && value.length > 0 && (
                <div className="text-center p-3 border border-dashed rounded-lg bg-muted/30">
                    <p className="text-sm text-muted-foreground">
                        Maximum number of files reached ({maxFiles})
                    </p>
                </div>
            )}

            {value.length === 0 && !canAddMore && (
                <p className="text-sm text-muted-foreground text-center py-4">
                    No files uploaded
                </p>
            )}

            {/* File Browser Popup */}
            {enableBrowser && projectId && (
                <FileBrowser
                    open={browserOpen}
                    onOpenChange={setBrowserOpen}
                    onSelect={handleBrowserSelect}
                    projectId={projectId}
                    maxFiles={maxFiles || 1}
                    acceptTypes={accept ? Object.keys(accept) : undefined}
                />
            )}
        </div>
    )
}
