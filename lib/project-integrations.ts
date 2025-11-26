import { Database, Mail, Users, LucideIcon } from "lucide-react"

export interface ProjectIntegration {
    id: "cms" | "email" | "crm"
    key: "enableCms" | "enableEmailMarketing" | "enableCrm"
    title: string
    description: string
    icon: LucideIcon
    color: string
    disabledColor: string
    isNew?: boolean
}

export const PROJECT_INTEGRATIONS: ProjectIntegration[] = [
    {
        id: "cms",
        key: "enableCms",
        title: "Content Management",
        description: "Manage content, collections, and schemas",
        icon: Database,
        color: "bg-blue-500/10 text-blue-700 dark:text-blue-400 border-blue-500/20 hover:bg-blue-500/20",
        disabledColor: "bg-muted/50 text-muted-foreground border-muted cursor-not-allowed opacity-60",
        isNew: true,
    },
    {
        id: "crm",
        key: "enableCrm",
        title: "CRM",
        description: "Customer relationship management tools",
        icon: Users,
        color: "bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-500/20 hover:bg-emerald-500/20",
        disabledColor: "bg-muted/50 text-muted-foreground border-muted cursor-not-allowed opacity-60",
        isNew: true,
    },
    {
        id: "email",
        key: "enableEmailMarketing",
        title: "Email Marketing",
        description: "Configure and manage email campaigns",
        icon: Mail,
        color: "bg-purple-500/10 text-purple-700 dark:text-purple-400 border-purple-500/20 hover:bg-purple-500/20",
        disabledColor: "bg-muted/50 text-muted-foreground border-muted cursor-not-allowed opacity-60",
        isNew: true,
    },
]

export interface ProjectIntegrationSettings {
    enableCms: boolean
    enableEmailMarketing: boolean
    enableCrm: boolean
}

export const DEFAULT_INTEGRATION_SETTINGS: ProjectIntegrationSettings = {
    enableCms: true,
    enableEmailMarketing: true,
    enableCrm: true,
}

export function isIntegrationEnabled(
    settings: Partial<ProjectIntegrationSettings>,
    integrationId: ProjectIntegration["id"]
): boolean {
    const integration = PROJECT_INTEGRATIONS.find((i) => i.id === integrationId)
    if (!integration) return false
    return settings[integration.key] ?? true
}
