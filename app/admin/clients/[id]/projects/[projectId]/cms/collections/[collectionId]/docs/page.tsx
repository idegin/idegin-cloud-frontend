"use client"

import { useParams, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft, BookOpen } from "lucide-react"
import { useCMSCollection } from "@/lib/contexts/cms-collection-context"

export default function CollectionDocsPage() {
    const params = useParams()
    const router = useRouter()
    const { cmsCollectionData } = useCMSCollection()
    
    const clientId = params.id as string
    const projectId = params.projectId as string
    const collectionId = params.collectionId as string

    const handleBack = () => {
        router.push(`/admin/clients/${clientId}/projects/${projectId}/cms/collections/${collectionId}`)
    }

    return (
        <div className="space-y-6">
            <div className="space-y-1">
                <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleBack}
                    className="-ml-2 mb-2"
                >
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Back to Collection
                </Button>
                <h1 className="text-3xl font-bold tracking-tight">API Documentation</h1>
                <p className="text-muted-foreground">
                    {cmsCollectionData.collection?.name || "Collection"} API reference
                </p>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <BookOpen className="h-5 w-5" />
                        Coming Soon
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="text-center py-12 space-y-4">
                        <div className="mx-auto w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
                            <BookOpen className="h-8 w-8 text-primary" />
                        </div>
                        <div className="space-y-2">
                            <h3 className="text-lg font-semibold">API Documentation Coming Soon</h3>
                            <p className="text-muted-foreground max-w-md mx-auto">
                                Comprehensive API documentation for accessing and managing your collection data
                                will be available here soon.
                            </p>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
