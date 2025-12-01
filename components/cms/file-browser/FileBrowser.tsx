"use client"

import React, { useState, useCallback, useRef, useEffect } from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Search, Upload, X, Grid3x3, List, FileImage, FileVideo, File as FileIcon, Check, Loader2, Download, Trash2, MoreVertical } from "lucide-react"
import { cn } from "@/lib/utils"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Badge } from "@/components/ui/badge"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { cmsApi } from "@/lib/api/cms"
import { useToast } from "@/hooks/use-toast"
import {
    ContextMenu,
    ContextMenuContent,
    ContextMenuItem,
    ContextMenuTrigger,
} from "@/components/ui/context-menu"
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog"

export interface BrowserFile {
    id: string
    key: string
    filename: string
    size: number
    contentType: string
    uploadedAt: string
    uploadedBy: string
    url?: string
}

interface FileBrowserProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    onSelect: (files: BrowserFile[]) => void
    projectId: string
    maxFiles?: number
    acceptTypes?: string[]
}

interface UploadingFile {
    id: string
    name: string
    size: number
    progress: number
    status: 'uploading' | 'success' | 'error'
}

export function FileBrowser({
    open,
    onOpenChange,
    onSelect,
    projectId,
    maxFiles = 1,
    acceptTypes
}: FileBrowserProps) {
    const [searchQuery, setSearchQuery] = useState("")
    const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
    const [filterType, setFilterType] = useState<string>("all")
    const [selectedFiles, setSelectedFiles] = useState<string[]>([])
    const [isDragging, setIsDragging] = useState(false)
    const [uploadingFiles, setUploadingFiles] = useState<UploadingFile[]>([])
    const [currentPage, setCurrentPage] = useState(1)
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
    const [fileToDelete, setFileToDelete] = useState<string | null>(null)
    const { toast } = useToast()
    const queryClient = useQueryClient()

    const multiple = maxFiles > 1

    // Fetch files from API
    const { data: filesData, isLoading, refetch } = useQuery({
        queryKey: ["cms-files", projectId, currentPage, searchQuery, filterType],
        queryFn: async () => {
            const result = await cmsApi.files.browse(projectId, {
                page: currentPage,
                limit: 50,
                search: searchQuery || undefined
            })
            
            return {
                ...result,
                files: result.files.map(file => ({
                    id: file.key,
                    ...file
                }))
            }
        },
        enabled: open && !!projectId,
        staleTime: 30000,
    })

    // Upload mutation
    const uploadMutation = useMutation({
        mutationFn: async (file: File) => {
            return await cmsApi.files.upload(projectId, file)
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["cms-files", projectId] })
            refetch()
        },
        onError: (error: any) => {
            toast({
                title: "Upload failed",
                description: error?.response?.data?.message || "Failed to upload file",
                variant: "destructive"
            })
        }
    })

    // Reset states when dialog opens
    React.useEffect(() => {
        if (open) {
            setSelectedFiles([])
            setCurrentPage(1)
            setSearchQuery("")
            setFilterType("all")
        }
    }, [open])

    const formatFileSize = (bytes: number) => {
        if (bytes === 0) return "0 Bytes"
        const k = 1024
        const sizes = ["Bytes", "KB", "MB", "GB"]
        const i = Math.floor(Math.log(bytes) / Math.log(k))
        return Math.round(bytes / Math.pow(k, i) * 100) / 100 + " " + sizes[i]
    }

    const formatDate = (dateStr: string) => {
        const date = new Date(dateStr)
        const now = new Date()
        const diff = now.getTime() - date.getTime()
        const days = Math.floor(diff / (1000 * 60 * 60 * 24))
        
        if (days === 0) return "Today"
        if (days === 1) return "Yesterday"
        if (days < 7) return `${days} days ago`
        return date.toLocaleDateString()
    }

    const getFileIcon = (contentType: string) => {
        if (contentType.startsWith("image/")) return FileImage
        if (contentType.startsWith("video/")) return FileVideo
        return FileIcon
    }

    const allFiles = filesData?.files || []
    const filteredFiles = allFiles.filter((file: BrowserFile) => {
        const matchesType = filterType === "all" || 
            (filterType === "images" && file.contentType.startsWith("image/")) ||
            (filterType === "videos" && file.contentType.startsWith("video/")) ||
            (filterType === "documents" && !file.contentType.startsWith("image/") && !file.contentType.startsWith("video/"))
        
        return matchesType
    })

    const toggleFileSelection = (fileId: string) => {
        setSelectedFiles(prev => {
            if (prev.includes(fileId)) {
                return prev.filter(id => id !== fileId)
            }
            return multiple ? [...prev, fileId] : [fileId]
        })
    }

    const handleSelect = () => {
        const selected = allFiles.filter(file => selectedFiles.includes(file.id))
        onSelect(selected)
        setSelectedFiles([])
        onOpenChange(false)
    }

    const handleDragOver = useCallback((e: React.DragEvent) => {
        e.preventDefault()
        e.stopPropagation()
        setIsDragging(true)
    }, [])

    const handleDragLeave = useCallback((e: React.DragEvent) => {
        e.preventDefault()
        e.stopPropagation()
        setIsDragging(false)
    }, [])

    const handleDrop = useCallback((e: React.DragEvent) => {
        e.preventDefault()
        e.stopPropagation()
        setIsDragging(false)
        
        const files = Array.from(e.dataTransfer.files)
        
        // Create uploading file entries
        const newUploadingFiles: UploadingFile[] = files.map(file => ({
            id: `${file.name}-${Date.now()}-${Math.random()}`,
            name: file.name,
            size: file.size,
            progress: 0,
            status: 'uploading' as const
        }))
        
        setUploadingFiles(newUploadingFiles)
        
        // Upload files
        files.forEach(async (file, index) => {
            const uploadFile = newUploadingFiles[index]
            
            try {
                // Simulate progress for UI
                let progress = 0
                const progressInterval = setInterval(() => {
                    progress += Math.random() * 20
                    if (progress >= 90) {
                        clearInterval(progressInterval)
                    }
                    setUploadingFiles(prev => 
                        prev.map(f => 
                            f.id === uploadFile.id && f.progress < 90
                                ? { ...f, progress: Math.min(progress, 90) }
                                : f
                        )
                    )
                }, 200)
                
                // Actual upload
                await uploadMutation.mutateAsync(file)
                
                clearInterval(progressInterval)
                
                // Mark as success
                setUploadingFiles(prev => 
                    prev.map(f => 
                        f.id === uploadFile.id 
                            ? { ...f, progress: 100, status: 'success' as const }
                            : f
                    )
                )
                
                // Remove after delay
                setTimeout(() => {
                    setUploadingFiles(prev => prev.filter(f => f.id !== uploadFile.id))
                }, 2000)
                
            } catch (error) {
                setUploadingFiles(prev => 
                    prev.map(f => 
                        f.id === uploadFile.id 
                            ? { ...f, status: 'error' as const }
                            : f
                    )
                )
            }
        })
    }, [uploadMutation])

    // Delete mutation
    const deleteMutation = useMutation({
        mutationFn: async (fileKeys: string[]) => {
            return await cmsApi.files.delete(projectId, fileKeys)
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["cms-files", projectId] })
            refetch()
            toast({
                title: "File deleted",
                description: "File has been permanently deleted",
            })
        },
        onError: (error: any) => {
            toast({
                title: "Delete failed",
                description: error?.response?.data?.message || "Failed to delete file",
                variant: "destructive"
            })
        }
    })

    const handleDelete = async () => {
        if (fileToDelete) {
            await deleteMutation.mutateAsync([fileToDelete])
            setDeleteDialogOpen(false)
            setFileToDelete(null)
        }
    }

    const handleDownload = async (fileKey: string) => {
        try {
            await cmsApi.files.download(projectId, fileKey)
        } catch (error) {
            toast({
                title: "Download failed",
                description: "Failed to download file",
                variant: "destructive"
            })
        }
    }

    return (
        <>
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent 
                className="lg:min-w-[60rem] min-w-[95%] h-[85vh] flex flex-col p-0"
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
            >
                {/* Drag Overlay */}
                {isDragging && (
                    <div className="absolute inset-0 z-50 bg-primary/10 backdrop-blur-sm border-4 border-dashed border-primary rounded-lg flex items-center justify-center">
                        <div className="text-center space-y-4">
                            <div className="w-20 h-20 mx-auto rounded-full bg-primary/20 flex items-center justify-center">
                                <Upload className="h-10 w-10 text-primary" />
                            </div>
                            <div>
                                <p className="text-lg font-semibold">Drop files to upload</p>
                                <p className="text-sm text-muted-foreground">Release to start uploading</p>
                            </div>
                        </div>
                    </div>
                )}

                <DialogHeader className="px-6 py-4 border-b">
                    <DialogTitle>Browse Files</DialogTitle>
                    <DialogDescription>
                        Select files from your media library
                    </DialogDescription>
                </DialogHeader>

                {/* Toolbar */}
                <div className="flex items-center gap-3 px-2 py-3 border-b bg-muted/30">
                    <div className="relative flex-1 max-w-md">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                            placeholder="Search files..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="pl-9"
                        />
                    </div>
                    
                    <Select value={filterType} onValueChange={setFilterType}>
                        <SelectTrigger className="w-[140px]">
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All Files</SelectItem>
                            <SelectItem value="images">Images</SelectItem>
                            <SelectItem value="videos">Videos</SelectItem>
                            <SelectItem value="documents">Documents</SelectItem>
                        </SelectContent>
                    </Select>

                    <div className="flex items-center border rounded-md">
                        <Button
                            variant={viewMode === "grid" ? "secondary" : "ghost"}
                            size="sm"
                            onClick={() => setViewMode("grid")}
                            className="rounded-r-none"
                        >
                            <Grid3x3 className="h-4 w-4" />
                        </Button>
                        <Button
                            variant={viewMode === "list" ? "secondary" : "ghost"}
                            size="sm"
                            onClick={() => setViewMode("list")}
                            className="rounded-l-none"
                        >
                            <List className="h-4 w-4" />
                        </Button>
                    </div>

                    <Button size="sm" variant="outline">
                        <Upload className="h-4 w-4 mr-2" />
                        Upload
                    </Button>
                </div>

                {/* File Grid/List */}
                <div className="flex-1 overflow-hidden">
                    <ScrollArea className="h-full px-2">
                    {isLoading ? (
                        <FileBrowserLoading viewMode={viewMode} />
                    ) : filteredFiles.length === 0 ? (
                        <div className="flex flex-col items-center justify-center h-full text-center py-12">
                            <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4">
                                <FileIcon className="h-8 w-8 text-muted-foreground" />
                            </div>
                            <p className="text-lg font-medium">No files found</p>
                            <p className="text-sm text-muted-foreground">
                                {searchQuery ? "Try adjusting your search" : "Upload files to get started"}
                            </p>
                        </div>
                    ) : viewMode === "grid" ? (
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                            {filteredFiles.map((file:BrowserFile) => {
                                const Icon = getFileIcon(file.contentType)
                                const isImage = /\.(jpg|jpeg|png|gif|webp|svg)$/i.test(file.filename)
                                const isSelected = selectedFiles.includes(file.id)

                                return (
                                    <ContextMenu key={file.id}>
                                        <ContextMenuTrigger>
                                            <div
                                                onClick={() => toggleFileSelection(file.id)}
                                                className={cn(
                                                    "group relative cursor-pointer rounded-lg border-2 transition-all hover:shadow-md",
                                                    isSelected ? "border-primary ring-2 ring-primary/20" : "border-transparent hover:border-border"
                                                )}
                                            >
                                                {/* Selection Indicator */}
                                                {isSelected && (
                                                    <div className="absolute top-2 right-2 z-10 w-6 h-6 rounded-full bg-primary flex items-center justify-center">
                                                        <Check className="h-4 w-4 text-primary-foreground" />
                                                    </div>
                                                )}

                                                {/* Thumbnail */}
                                                <div className="aspect-square rounded-t-lg overflow-hidden bg-muted">
                                                    {isImage && file.url ? (
                                                        <LazyImage
                                                            src={file.url}
                                                            alt={file.filename}
                                                            className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                                                        />
                                                    ) : (
                                                        <div className="w-full h-full flex items-center justify-center">
                                                            <Icon className="h-12 w-12 text-muted-foreground" />
                                                        </div>
                                                    )}
                                                </div>

                                                {/* File Info */}
                                                <div className="p-3 space-y-1">
                                                    <p className="text-sm font-medium truncate">{file.filename}</p>
                                                    <p className="text-xs text-muted-foreground">{formatFileSize(file.size)}</p>
                                                </div>
                                            </div>
                                        </ContextMenuTrigger>
                                        <ContextMenuContent>
                                            <ContextMenuItem onClick={() => handleDownload(file.key)}>
                                                <Download className="h-4 w-4 mr-2" />
                                                Download
                                            </ContextMenuItem>
                                            <ContextMenuItem 
                                                onClick={() => {
                                                    setFileToDelete(file.key)
                                                    setDeleteDialogOpen(true)
                                                }}
                                                className="text-destructive focus:text-destructive"
                                            >
                                                <Trash2 className="h-4 w-4 mr-2" />
                                                Delete
                                            </ContextMenuItem>
                                        </ContextMenuContent>
                                    </ContextMenu>
                                )
                            })}
                        </div>
                    ) : (
                        <div className="space-y-2">
                            {filteredFiles.map((file:BrowserFile) => {
                                const Icon = getFileIcon(file.contentType)
                                const isImage = /\.(jpg|jpeg|png|gif|webp|svg)$/i.test(file.filename)
                                const isSelected = selectedFiles.includes(file.id)

                                return (
                                    <ContextMenu key={file.id}>
                                        <ContextMenuTrigger>
                                            <div
                                                onClick={() => toggleFileSelection(file.id)}
                                                className={cn(
                                                    "flex items-center gap-4 p-3 rounded-lg border cursor-pointer transition-all hover:bg-accent/50",
                                                    isSelected ? "border-primary bg-primary/5" : "border-border"
                                                )}
                                            >
                                                {/* Thumbnail */}
                                                <div className="flex-shrink-0">
                                                    {isImage && file.url ? (
                                                        <LazyImage
                                                            src={file.url}
                                                            alt={file.filename}
                                                            className="w-12 h-12 rounded object-cover"
                                                        />
                                                    ) : (
                                                        <div className="w-12 h-12 rounded bg-muted flex items-center justify-center">
                                                            <Icon className="h-6 w-6 text-muted-foreground" />
                                                        </div>
                                                    )}
                                                </div>

                                                {/* File Info */}
                                                <div className="flex-1 min-w-0">
                                                    <p className="font-medium truncate">{file.filename}</p>
                                                    <div className="flex items-center gap-3 text-xs text-muted-foreground">
                                                        <span>{formatFileSize(file.size)}</span>
                                                        <span>•</span>
                                                        <span>{formatDate(file.uploadedAt)}</span>
                                                        <span>•</span>
                                                        <span>{file.uploadedBy}</span>
                                                    </div>
                                                </div>

                                                {/* Selection Indicator */}
                                                {isSelected && (
                                                    <div className="w-6 h-6 rounded-full bg-primary flex items-center justify-center">
                                                        <Check className="h-4 w-4 text-primary-foreground" />
                                                    </div>
                                                )}
                                            </div>
                                        </ContextMenuTrigger>
                                        <ContextMenuContent>
                                            <ContextMenuItem onClick={() => handleDownload(file.key)}>
                                                <Download className="h-4 w-4 mr-2" />
                                                Download
                                            </ContextMenuItem>
                                            <ContextMenuItem 
                                                onClick={() => {
                                                    setFileToDelete(file.key)
                                                    setDeleteDialogOpen(true)
                                                }}
                                                className="text-destructive focus:text-destructive"
                                            >
                                                <Trash2 className="h-4 w-4 mr-2" />
                                                Delete
                                            </ContextMenuItem>
                                        </ContextMenuContent>
                                    </ContextMenu>
                                )
                            })}
                        </div>
                    )}
                    </ScrollArea>
                </div>

                {/* Upload Progress */}
                {uploadingFiles.length > 0 && (
                    <div className="px-6 py-3 border-t bg-muted/30 space-y-2 max-h-[200px] overflow-y-auto">
                        {uploadingFiles.map((file) => (
                            <div key={file.id} className="space-y-2 p-3 bg-background rounded-lg border">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-3 flex-1 min-w-0">
                                        <div className="flex-shrink-0">
                                            {file.status === 'success' ? (
                                                <div className="w-10 h-10 rounded-full bg-green-500/10 flex items-center justify-center">
                                                    <Check className="h-5 w-5 text-green-600" />
                                                </div>
                                            ) : (
                                                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                                                    <Upload className="h-5 w-5 text-primary animate-pulse" />
                                                </div>
                                            )}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="text-sm font-medium truncate">{file.name}</p>
                                            <p className="text-xs text-muted-foreground">
                                                {formatFileSize(file.size)} • {file.progress.toFixed(0)}%
                                            </p>
                                        </div>
                                    </div>
                                </div>
                                <div className="relative h-1.5 bg-muted rounded-full overflow-hidden">
                                    <div 
                                        className="absolute inset-y-0 left-0 bg-primary transition-all duration-300 ease-out rounded-full"
                                        style={{ width: `${file.progress}%` }}
                                    />
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {/* Footer */}
                <div className="flex items-center justify-between px-6 py-4 border-t bg-muted/30">
                    <div className="text-sm text-muted-foreground">
                        {selectedFiles.length > 0 ? (
                            <span>{selectedFiles.length} file{selectedFiles.length > 1 ? "s" : ""} selected</span>
                        ) : (
                            <span>{filteredFiles.length} file{filteredFiles.length !== 1 ? "s" : ""}</span>
                        )}
                    </div>
                    <div className="flex gap-2">
                        <Button variant="outline" onClick={() => onOpenChange(false)}>
                            Cancel
                        </Button>
                        <Button 
                            onClick={handleSelect}
                            disabled={selectedFiles.length === 0}
                        >
                            Select {selectedFiles.length > 0 && `(${selectedFiles.length})`}
                        </Button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>

        {/* Delete Confirmation Dialog */}
        <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Delete File</AlertDialogTitle>
                    <AlertDialogDescription>
                        Are you sure you want to delete this file? This action cannot be undone and the file will be permanently removed from storage.
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction
                        onClick={handleDelete}
                        className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                    >
                        Delete
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
        </>
    )
}

// Lazy loading image component
function LazyImage({ src, alt, className }: { src: string; alt: string; className?: string }) {
    const [isLoaded, setIsLoaded] = useState(false)
    const [isInView, setIsInView] = useState(false)
    const imgRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        if (!imgRef.current) return

        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setIsInView(true)
                    observer.disconnect()
                }
            },
            { threshold: 0.1 }
        )

        observer.observe(imgRef.current)

        return () => observer.disconnect()
    }, [])

    return (
        <div ref={imgRef} className={cn("relative", className)}>
            {!isLoaded && (
                <div className="absolute inset-0 bg-muted animate-pulse" />
            )}
            {isInView && (
                <img
                    src={src}
                    alt={alt}
                    className={cn(className, "transition-opacity", isLoaded ? "opacity-100" : "opacity-0")}
                    onLoad={() => setIsLoaded(true)}
                />
            )}
        </div>
    )
}

function FileBrowserLoading({ viewMode }: { viewMode: "grid" | "list" }) {
    const items = Array.from({ length: viewMode === "grid" ? 10 : 6 })

    if (viewMode === "grid") {
        return (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                {items.map((_, i) => (
                    <div key={i} className="space-y-2 animate-pulse">
                        <div className="aspect-square rounded-lg bg-muted" />
                        <div className="h-4 bg-muted rounded w-3/4" />
                        <div className="h-3 bg-muted rounded w-1/2" />
                    </div>
                ))}
            </div>
        )
    }

    return (
        <div className="space-y-2">
            {items.map((_, i) => (
                <div key={i} className="flex items-center gap-4 p-3 animate-pulse">
                    <div className="w-12 h-12 rounded bg-muted" />
                    <div className="flex-1 space-y-2">
                        <div className="h-4 bg-muted rounded w-1/3" />
                        <div className="h-3 bg-muted rounded w-1/2" />
                    </div>
                </div>
            ))}
        </div>
    )
}
