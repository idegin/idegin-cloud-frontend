"use client"

import React, { useState, useEffect, useCallback, useMemo } from "react"
import { useQuery } from "@tanstack/react-query"
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetDescription,
} from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Badge } from "@/components/ui/badge"
import { 
    Copy, 
    Check, 
    Download, 
    Code2, 
    FileCode2,
    RefreshCw,
    AlertCircle
} from "lucide-react"
import { cmsApi } from "@/lib/api/cms"
import { cn } from "@/lib/utils"

interface CMSTypesSheetProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    projectId: string
    projectName?: string
    collectionSlug?: string
    collectionName?: string
}

const tokenize = (code: string): React.ReactNode[] => {
    const lines = code.split('\n')
    
    return lines.map((line, lineIndex) => {
        const tokens: React.ReactNode[] = []
        let remaining = line
        let key = 0

        const patterns: [RegExp, string][] = [
            [/^(\/\*\*|\s\*|\s\*\/|\/\/)/, 'text-muted-foreground/70 italic'],
            [/^(export|async|function|const|type|interface|return|await|if|throw|new)\b/, 'text-purple-500 dark:text-purple-400 font-medium'],
            [/^(string|number|boolean|null|undefined|unknown|void|Promise|Record|Partial)\b/, 'text-cyan-500 dark:text-cyan-400'],
            [/^(true|false)\b/, 'text-orange-500 dark:text-orange-400'],
            [/^"[^"]*"/, 'text-emerald-500 dark:text-emerald-400'],
            [/^'[^']*'/, 'text-emerald-500 dark:text-emerald-400'],
            [/^`[^`]*`/, 'text-emerald-500 dark:text-emerald-400'],
            [/^\d+/, 'text-orange-500 dark:text-orange-400'],
            [/^(=>|:|\?|&|\|)/, 'text-muted-foreground'],
            [/^[{}\[\]();,.]/, 'text-muted-foreground'],
            [/^[a-zA-Z_$][a-zA-Z0-9_$]*(?=\s*[:(])/, 'text-blue-500 dark:text-blue-400'],
            [/^[a-zA-Z_$][a-zA-Z0-9_$]*/, 'text-foreground'],
            [/^\s+/, ''],
        ]

        while (remaining.length > 0) {
            let matched = false

            for (const [pattern, className] of patterns) {
                const match = remaining.match(pattern)
                if (match) {
                    const text = match[0]
                    if (className) {
                        tokens.push(
                            <span key={key++} className={className}>
                                {text}
                            </span>
                        )
                    } else {
                        tokens.push(<span key={key++}>{text}</span>)
                    }
                    remaining = remaining.slice(text.length)
                    matched = true
                    break
                }
            }

            if (!matched) {
                tokens.push(<span key={key++}>{remaining[0]}</span>)
                remaining = remaining.slice(1)
            }
        }

        return (
            <div key={lineIndex} className="leading-6">
                {tokens.length > 0 ? tokens : '\u00A0'}
            </div>
        )
    })
}

export function CMSTypesSheet({ 
    open, 
    onOpenChange, 
    projectId,
    projectName,
    collectionSlug,
    collectionName,
}: CMSTypesSheetProps) {
    const [copied, setCopied] = useState(false)

    const queryKey = collectionSlug 
        ? ["cms-types", projectId, collectionSlug] 
        : ["cms-types", projectId]

    const fetchTypes = useCallback(() => {
        if (collectionSlug) {
            return cmsApi.docs.getCollectionTypes(projectId, collectionSlug)
        }
        return cmsApi.docs.getTypes(projectId)
    }, [projectId, collectionSlug])

    const { 
        data, 
        isLoading, 
        error, 
        refetch,
        isFetching 
    } = useQuery({
        queryKey,
        queryFn: fetchTypes,
        enabled: open,
        staleTime: 1000 * 60 * 5,
        refetchOnWindowFocus: false,
    })

    const highlightedCode = useMemo(() => {
        if (!data?.types) return null
        return tokenize(data.types)
    }, [data?.types])

    const handleCopy = useCallback(async () => {
        if (!data?.types) return
        
        try {
            await navigator.clipboard.writeText(data.types)
            setCopied(true)
            setTimeout(() => setCopied(false), 2000)
        } catch (err) {
            console.error("Failed to copy:", err)
        }
    }, [data?.types])

    const handleDownload = useCallback(() => {
        if (!data?.types) return

        const filename = collectionSlug ? `${collectionSlug}-types.ts` : "cms-types.ts"
        const blob = new Blob([data.types], { type: "text/typescript" })
        const url = URL.createObjectURL(blob)
        const a = document.createElement("a")
        a.href = url
        a.download = filename
        document.body.appendChild(a)
        a.click()
        document.body.removeChild(a)
        URL.revokeObjectURL(url)
    }, [data?.types, collectionSlug])

    useEffect(() => {
        if (!open) {
            setCopied(false)
        }
    }, [open])

    const title = collectionSlug ? `${collectionName || collectionSlug} Docs` : "Documentation"
    const description = collectionSlug 
        ? `Auto-generated types for the ${collectionName || collectionSlug} collection.`
        : `Auto-generated types for ${projectName || "your project"}'s CMS collections.`

    return (
        <Sheet open={open} onOpenChange={onOpenChange}>
            <SheetContent 
                side="right" 
                className="w-full sm:max-w-2xl lg:max-w-3xl flex flex-col p-0"
            >
                <SheetHeader className="px-6 pt-6 pb-4 border-b bg-muted/30">
                    <div className="flex items-start justify-between gap-4 pr-8">
                        <div className="space-y-1.5">
                            <div className="flex items-center gap-2">
                                <div className="flex items-center justify-center h-8 w-8 rounded-md bg-primary/10">
                                    <FileCode2 className="h-4 w-4 text-primary" />
                                </div>
                                <SheetTitle className="text-lg">
                                    {title}
                                </SheetTitle>
                            </div>
                            <SheetDescription className="text-sm">
                                {description}
                            </SheetDescription>
                        </div>
                    </div>

                    <div className="flex items-center gap-2 pt-3">
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => refetch()}
                            disabled={isFetching}
                            className="gap-2"
                        >
                            <RefreshCw className={cn(
                                "h-3.5 w-3.5",
                                isFetching && "animate-spin"
                            )} />
                            Regenerate
                        </Button>
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={handleCopy}
                            disabled={!data?.types || isLoading}
                            className="gap-2"
                        >
                            {copied ? (
                                <>
                                    <Check className="h-3.5 w-3.5 text-green-500" />
                                    Copied!
                                </>
                            ) : (
                                <>
                                    <Copy className="h-3.5 w-3.5" />
                                    Copy
                                </>
                            )}
                        </Button>
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={handleDownload}
                            disabled={!data?.types || isLoading}
                            className="gap-2"
                        >
                            <Download className="h-3.5 w-3.5" />
                            Download
                        </Button>
                    </div>

                    {data?.generatedAt && (
                        <div className="flex items-center gap-2 pt-2">
                            <Badge variant="secondary" className="text-xs font-normal">
                                <Code2 className="h-3 w-3 mr-1" />
                                TypeScript
                            </Badge>
                            <span className="text-xs text-muted-foreground">
                                Generated {new Date(data.generatedAt).toLocaleString()}
                            </span>
                        </div>
                    )}
                </SheetHeader>

                <div className="flex-1 min-h-0">
                    {isLoading ? (
                        <TypesLoadingSkeleton />
                    ) : error ? (
                        <div className="flex flex-col items-center justify-center h-full p-6 text-center">
                            <div className="flex items-center justify-center h-12 w-12 rounded-full bg-destructive/10 mb-4">
                                <AlertCircle className="h-6 w-6 text-destructive" />
                            </div>
                            <h3 className="font-medium text-lg mb-1">Failed to load types</h3>
                            <p className="text-sm text-muted-foreground mb-4 max-w-sm">
                                {(error as Error)?.message || "An error occurred while generating types. Please try again."}
                            </p>
                            <Button variant="outline" onClick={() => refetch()}>
                                <RefreshCw className="h-4 w-4 mr-2" />
                                Try Again
                            </Button>
                        </div>
                    ) : data?.types ? (
                        <ScrollArea className="h-full grid grid-cols-1">
                            <div className="p-4 grid grid-cols-1">
                                <pre className="text-[13px] font-mono bg-muted/50 rounded-lg p-4 overflow-x-auto border">
                                    <code className="whitespace-pre">
                                        {highlightedCode}
                                    </code>
                                </pre>
                            </div>
                        </ScrollArea>
                    ) : (
                        <div className="flex flex-col items-center justify-center h-full p-6 text-center">
                            <div className="flex items-center justify-center h-12 w-12 rounded-full bg-muted mb-4">
                                <FileCode2 className="h-6 w-6 text-muted-foreground" />
                            </div>
                            <h3 className="font-medium text-lg mb-1">No types available</h3>
                            <p className="text-sm text-muted-foreground">
                                {collectionSlug 
                                    ? "Add fields to this collection to generate types."
                                    : "Create collections in your CMS to generate types."
                                }
                            </p>
                        </div>
                    )}
                </div>
            </SheetContent>
        </Sheet>
    )
}

function TypesLoadingSkeleton() {
    return (
        <div className="p-4 space-y-4">
            <div className="bg-muted/50 rounded-lg p-4 border space-y-3">
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
                <Skeleton className="h-4 w-2/3" />
                <div className="pt-2" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-5/6" />
                <Skeleton className="h-4 w-4/5" />
                <Skeleton className="h-4 w-3/4" />
                <div className="pt-2" />
                <Skeleton className="h-4 w-1/3" />
                <div className="pl-4 space-y-2">
                    <Skeleton className="h-4 w-2/3" />
                    <Skeleton className="h-4 w-1/2" />
                    <Skeleton className="h-4 w-3/5" />
                    <Skeleton className="h-4 w-2/5" />
                </div>
                <Skeleton className="h-4 w-1/4" />
                <div className="pt-2" />
                <Skeleton className="h-4 w-1/3" />
                <div className="pl-4 space-y-2">
                    <Skeleton className="h-4 w-3/4" />
                    <Skeleton className="h-4 w-2/3" />
                    <Skeleton className="h-4 w-1/2" />
                </div>
                <Skeleton className="h-4 w-1/4" />
            </div>
        </div>
    )
}
