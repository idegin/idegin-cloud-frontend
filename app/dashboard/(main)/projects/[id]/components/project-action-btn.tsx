"use client"

import React, { useMemo } from "react"
import { useParams } from "next/navigation"
import { useRouter } from 'next13-progressbar'
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { Sparkles, Clock } from "lucide-react"
import { PROJECT_INTEGRATIONS, ProjectIntegrationSettings } from "@/lib/project-integrations"

interface ProjectActionBtnProps {
    integrationSettings?: Partial<ProjectIntegrationSettings>
}

export default function ProjectActionBtn({ integrationSettings }: ProjectActionBtnProps) {
    const router = useRouter()
    const params = useParams()
    const projectId = params.id as string

    const enabledIntegrations = useMemo(() => {
        return PROJECT_INTEGRATIONS.filter((integration) => {
            if (integration.comingSoon) return true
            return integrationSettings?.[integration.key] ?? false
        })
    }, [integrationSettings])

    const getHref = (integrationId: string) => {
        const basePath = `/dashboard/projects/${projectId}`
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

    const handleActionClick = (integrationId: string) => {
        router.push(getHref(integrationId))
    }

    if (enabledIntegrations.length === 0) {
        return null
    }

    return (
        <Card className="overflow-auto">
            <CardHeader>
                <CardTitle>Project Integration</CardTitle>
                <CardDescription>
                    Quick access to project management tools and features
                </CardDescription>
            </CardHeader>
            <CardContent className="overflow-auto">
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {enabledIntegrations.map((integration) => {
                        const Icon = integration.icon
                        const isComingSoon = integration.comingSoon
                        return (
                            <button
                                key={integration.id}
                                onClick={() => !isComingSoon && handleActionClick(integration.id)}
                                disabled={isComingSoon}
                                className={`relative group text-left p-4 rounded-lg border transition-all overflow-hidden ${
                                    isComingSoon 
                                        ? "bg-muted/30 border-muted cursor-not-allowed opacity-70" 
                                        : `cursor-pointer ${integration.color}`
                                }`}
                            >
                                {isComingSoon && (
                                    <div className="absolute top-1 right-1 z-10">
                                        <div className="bg-amber-500/20 text-amber-700 dark:text-amber-400 text-[10px] font-medium px-2 py-0.5 rounded-bl-lg rounded-tr-lg flex items-center gap-1">
                                            <Clock className="h-2.5 w-2.5" />
                                            COMING SOON
                                        </div>
                                    </div>
                                )}
                                {!isComingSoon && integration.isNew && (
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
                                <div className="flex items-start gap-4">
                                    <div className={`p-2 rounded-md ${isComingSoon ? "bg-muted" : integration.color}`}>
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
    )
}
