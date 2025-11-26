"use client"

import React, { useState } from "react"
import { useRouter } from 'next13-progressbar'
import { useParams } from "next/navigation"
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Sparkles, Ban, Mail, AlertCircle } from "lucide-react"
import { PROJECT_INTEGRATIONS, ProjectIntegrationSettings, ProjectIntegration } from "@/lib/project-integrations"

interface AdminProjectIntegrationProps {
    integrationSettings?: Partial<ProjectIntegrationSettings>
}

export default function AdminProjectIntegration({ integrationSettings }: AdminProjectIntegrationProps) {
    const router = useRouter()
    const params = useParams()
    const organizationId = params.id as string
    const projectId = params.projectId as string
    const [disabledDialogOpen, setDisabledDialogOpen] = useState(false)
    const [selectedIntegration, setSelectedIntegration] = useState<ProjectIntegration | null>(null)

    const getHref = (integrationId: string) => {
        const basePath = `/admin/clients/${organizationId}/projects/${projectId}`
        switch (integrationId) {
            case "cms":
                return `${basePath}/cms`
            case "crm":
                return `${basePath}/crm`
            case "email":
                return `${basePath}/email`
            default:
                return basePath
        }
    }

    const handleActionClick = (integration: ProjectIntegration, isEnabled: boolean) => {
        if (isEnabled) {
            router.push(getHref(integration.id))
        } else {
            setSelectedIntegration(integration)
            setDisabledDialogOpen(true)
        }
    }

    const handleContactSupport = () => {
        window.location.href = "mailto:support@idegin.com?subject=Enable%20Integration%20Request"
        setDisabledDialogOpen(false)
    }

    return (
        <>
            <Card className="overflow-auto">
                <CardHeader>
                    <CardTitle>Project Integration</CardTitle>
                    <CardDescription>
                        Quick access to project management tools and features
                    </CardDescription>
                </CardHeader>
                <CardContent className="overflow-auto">
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                        {PROJECT_INTEGRATIONS.map((integration) => {
                            const Icon = integration.icon
                            const isEnabled = integrationSettings?.[integration.key] ?? true
                            return (
                                <button
                                    key={integration.id}
                                    onClick={() => handleActionClick(integration, isEnabled)}
                                    className={`relative group text-left p-4 rounded-lg border transition-all overflow-hidden cursor-pointer ${
                                        isEnabled ? integration.color : "bg-muted/30 border-muted hover:bg-muted/50"
                                    }`}
                                >
                                    {isEnabled && integration.isNew && (
                                        <div className="absolute top-1 right-1 z-10">
                                            <div className="relative">
                                                <div className="bg-gradient-to-r from-primary via-primary/90 to-primary/80 text-primary-foreground text-[10px] font-bold px-2 py-0.5 rounded-bl-lg rounded-tr-lg shadow-lg flex items-center gap-1">
                                                    <Sparkles className="h-2.5 w-2.5 animate-pulse" />
                                                    NEW
                                                </div>
                                                <div className="absolute inset-0 bg-gradient-to-r from-primary/50 to-transparent blur-sm animate-pulse" />
                                            </div>
                                        </div>
                                    )}
                                    {!isEnabled && (
                                        <div className="absolute top-1 right-1 z-10">
                                            <div className="bg-muted text-muted-foreground text-[10px] font-medium px-2 py-0.5 rounded-bl-lg rounded-tr-lg flex items-center gap-1">
                                                <Ban className="h-2.5 w-2.5" />
                                                DISABLED
                                            </div>
                                        </div>
                                    )}
                                    <div className="flex items-start gap-4">
                                        <div className={`p-2 rounded-md ${isEnabled ? integration.color : "bg-muted"}`}>
                                            <Icon className="h-5 w-5" />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <h3 className="font-semibold text-sm mb-1">
                                                {integration.title}
                                            </h3>
                                            <p className="text-xs text-muted-foreground line-clamp-2">
                                                {integration.description}
                                            </p>
                                        </div>
                                    </div>
                                </button>
                            )
                        })}
                    </div>
                </CardContent>
            </Card>

            <Dialog open={disabledDialogOpen} onOpenChange={setDisabledDialogOpen}>
                <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-amber-100 dark:bg-amber-900/30 mb-4">
                            <AlertCircle className="h-6 w-6 text-amber-600 dark:text-amber-400" />
                        </div>
                        <DialogTitle className="text-center">
                            Integration Not Enabled
                        </DialogTitle>
                        <DialogDescription className="text-center">
                            The <span className="font-semibold text-foreground">{selectedIntegration?.title}</span> integration 
                            is not enabled for this project. Please contact iDegin support to enable this feature.
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter className="flex-col sm:flex-col gap-2 mt-4">
                        <Button onClick={handleContactSupport} className="w-full">
                            <Mail className="h-4 w-4 mr-2" />
                            Contact Support
                        </Button>
                        <Button variant="outline" onClick={() => setDisabledDialogOpen(false)} className="w-full">
                            Close
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    )
}
