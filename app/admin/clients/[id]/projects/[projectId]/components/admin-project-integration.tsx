"use client"

import React from "react"
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
    Database,
    Mail,
    Users,
    Sparkles,
} from "lucide-react"

interface ActionButton {
    id: string
    title: string
    description: string
    icon: React.ElementType
    href: string
    color: string
    available: boolean
    isNew?: boolean
}

export default function AdminProjectIntegration() {
    const router = useRouter()
    const params = useParams()
    const organizationId = params.id as string
    const projectId = params.projectId as string

    const actions: ActionButton[] = [
        {
            id: "cms",
            title: "Content Management",
            description: "Manage content, collections, and schemas",
            icon: Database,
            href: `/admin/clients/${organizationId}/projects/${projectId}/cms`,
            color: "bg-blue-500/10 text-blue-700 dark:text-blue-400 border-blue-500/20 hover:bg-blue-500/20",
            available: true,
            isNew: true,
        },
        {
            id: "crm",
            title: "CRM",
            description: "Customer relationship management tools",
            icon: Users,
            href: `/admin/clients/${organizationId}/projects/${projectId}/crm`,
            color: "bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-500/20 hover:bg-emerald-500/20",
            available: true,
            isNew: true,
        },
        {
            id: "email",
            title: "Email Marketing",
            description: "Configure and manage email campaigns",
            icon: Mail,
            href: `/admin/clients/${organizationId}/projects/${projectId}/email`,
            color: "bg-purple-500/10 text-purple-700 dark:text-purple-400 border-purple-500/20 hover:bg-purple-500/20",
            available: true,
            isNew: true,
        },
    ]

    const handleActionClick = (action: ActionButton) => {
        if (action.available) {
            router.push(action.href)
        }
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
                    {actions.map((action) => {
                        const Icon = action.icon
                        return (
                            <button
                                key={action.id}
                                onClick={() => handleActionClick(action)}
                                className={`relative group text-left p-4 rounded-lg border transition-all cursor-pointer overflow-hidden ${action.color}`}
                            >
                                {action.isNew && (
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
                                    <div className={`p-2 rounded-md ${action.color}`}>
                                        <Icon className="h-5 w-5" />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <h3 className="font-semibold text-sm mb-1">
                                            {action.title}
                                        </h3>
                                        <p className="text-xs text-muted-foreground line-clamp-2">
                                            {action.description}
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
