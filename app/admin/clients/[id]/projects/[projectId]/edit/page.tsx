"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Skeleton } from "@/components/ui/skeleton"
import { ArrowLeft, Loader2, Save } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { useProjectFullDetails } from "@/lib/hooks/use-projects"
import { ProjectsService } from "@/lib/api/services/ProjectsService"
import { PROJECT_INTEGRATIONS } from "@/lib/project-integrations"
import { SectionPlaceholder } from "@/components/shared/section-placeholder"

interface FormData {
    projectName: string
    description: string
    monthly_billing: string
    maxStorageGB: string
    enableCms: boolean
    enableEmailMarketing: boolean
    enableCrm: boolean
}

export default function EditProjectPage() {
    const params = useParams()
    const router = useRouter()
    const { toast } = useToast()
    const organizationId = params.id as string
    const projectId = params.projectId as string

    const { data, isLoading, error, refetch } = useProjectFullDetails(projectId)
    const [isSaving, setIsSaving] = useState(false)
    const [formData, setFormData] = useState<FormData>({
        projectName: "",
        description: "",
        monthly_billing: "",
        maxStorageGB: "1",
        enableCms: true,
        enableEmailMarketing: true,
        enableCrm: true,
    })

    useEffect(() => {
        if (data?.project) {
            const project = data.project
            setFormData({
                projectName: project.projectName || "",
                description: project.description || "",
                monthly_billing: project.monthly_billing?.toString() || "",
                maxStorageGB: project.maxStorageGB?.toString() || "1",
                enableCms: project.enableCms ?? true,
                enableEmailMarketing: project.enableEmailMarketing ?? true,
                enableCrm: project.enableCrm ?? true,
            })
        }
    }, [data])

    const updateFormData = (updates: Partial<FormData>) => {
        setFormData(prev => ({ ...prev, ...updates }))
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsSaving(true)

        try {
            await ProjectsService.putProjects(projectId, {
                projectName: formData.projectName,
                description: formData.description,
                monthly_billing: parseFloat(formData.monthly_billing) || 0,
            })

            toast({
                title: "Success!",
                description: "Project updated successfully.",
            })

            refetch()
            router.push(`/admin/clients/${organizationId}/projects/${projectId}`)
        } catch (error: any) {
            console.error("Failed to update project:", error)
            toast({
                variant: "destructive",
                title: "Error",
                description: error?.body?.message || "Failed to update project. Please try again.",
            })
        } finally {
            setIsSaving(false)
        }
    }

    const handleBack = () => {
        router.push(`/admin/clients/${organizationId}/projects/${projectId}`)
    }

    if (isLoading) {
        return (
            <div className="container mx-auto max-w-3xl px-4">
                <div className="mb-6">
                    <Skeleton className="h-10 w-24 mb-4" />
                    <Skeleton className="h-9 w-64" />
                    <Skeleton className="h-5 w-96 mt-2" />
                </div>
                <Card>
                    <CardHeader>
                        <Skeleton className="h-6 w-48" />
                        <Skeleton className="h-4 w-72" />
                    </CardHeader>
                    <CardContent className="space-y-6">
                        {[1, 2, 3, 4].map((i) => (
                            <div key={i} className="space-y-2">
                                <Skeleton className="h-4 w-24" />
                                <Skeleton className="h-11 w-full" />
                            </div>
                        ))}
                    </CardContent>
                </Card>
            </div>
        )
    }

    if (error) {
        return (
            <div className="space-y-6">
                <Button variant="ghost" onClick={handleBack} className="mb-2 -ml-2">
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Go back
                </Button>
                <SectionPlaceholder
                    variant="error"
                    title="Failed to load project"
                    description="There was an error loading the project details. Please try again."
                    action={{
                        label: "Try Again",
                        onClick: () => refetch(),
                    }}
                />
            </div>
        )
    }

    if (!data?.project) {
        return (
            <div className="space-y-6">
                <Button variant="ghost" onClick={handleBack} className="mb-2 -ml-2">
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Go back
                </Button>
                <SectionPlaceholder
                    variant="info"
                    title="Project not found"
                    description="The project you're looking for doesn't exist or you don't have access to it."
                />
            </div>
        )
    }

    return (
        <div className="container mx-auto max-w-3xl px-4">
            <div className="mb-6">
                <Button variant="ghost" onClick={handleBack} className="mb-2 -ml-2">
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Go back
                </Button>
                <h1 className="text-3xl font-bold tracking-tight">Edit Project</h1>
                <p className="text-muted-foreground mt-2">
                    Update the project details and configuration
                </p>
            </div>

            <form onSubmit={handleSubmit}>
                <Card>
                    <CardHeader>
                        <CardTitle>Project Details</CardTitle>
                        <CardDescription>
                            Basic information about the project
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="space-y-2">
                            <Label htmlFor="projectName" className="text-sm font-medium">
                                Project Name
                            </Label>
                            <Input
                                id="projectName"
                                placeholder="e.g., Company Website Redesign"
                                value={formData.projectName}
                                onChange={(e) => updateFormData({ projectName: e.target.value })}
                                className="h-11"
                                required
                            />
                            <p className="text-xs text-muted-foreground">
                                A descriptive name for your project
                            </p>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="description" className="text-sm font-medium">
                                Description
                            </Label>
                            <Textarea
                                id="description"
                                placeholder="Provide a detailed description of the project..."
                                value={formData.description}
                                onChange={(e) => updateFormData({ description: e.target.value })}
                                className="min-h-[120px] resize-none"
                                required
                            />
                            <p className="text-xs text-muted-foreground">
                                Describe the project goals and key requirements
                            </p>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="monthly_billing" className="text-sm font-medium">
                                Monthly Billing
                            </Label>
                            <div className="relative">
                                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                                    ₦
                                </span>
                                <Input
                                    id="monthly_billing"
                                    type="number"
                                    placeholder="10000"
                                    value={formData.monthly_billing}
                                    onChange={(e) => updateFormData({ monthly_billing: e.target.value })}
                                    className="h-11 pl-7"
                                    min="0"
                                    step="100"
                                />
                            </div>
                            <p className="text-xs text-muted-foreground">
                                Monthly billing amount in Naira
                            </p>
                        </div>

                        <div className="space-y-4 pt-4 border-t">
                            <div>
                                <Label className="text-sm font-medium">Project Integrations</Label>
                                <p className="text-xs text-muted-foreground mt-1">
                                    Enable or disable features for this project
                                </p>
                            </div>
                            <div className="grid gap-4">
                                {PROJECT_INTEGRATIONS.map((integration) => {
                                    const Icon = integration.icon
                                    const isEnabled = formData[integration.key as keyof FormData] as boolean
                                    return (
                                        <div
                                            key={integration.id}
                                            className={`flex items-center justify-between p-4 rounded-lg border ${
                                                isEnabled ? integration.color : "bg-muted/30 border-muted"
                                            }`}
                                        >
                                            <div className="flex items-center gap-3">
                                                <div className={`p-2 rounded-md ${isEnabled ? integration.color : "bg-muted"}`}>
                                                    <Icon className="h-5 w-5" />
                                                </div>
                                                <div>
                                                    <h4 className="text-sm font-medium">{integration.title}</h4>
                                                    <p className="text-xs text-muted-foreground">{integration.description}</p>
                                                </div>
                                            </div>
                                            <Switch
                                                checked={isEnabled}
                                                onCheckedChange={(checked) => updateFormData({ [integration.key]: checked } as Partial<FormData>)}
                                                disabled
                                            />
                                        </div>
                                    )
                                })}
                            </div>
                            <p className="text-xs text-muted-foreground italic">
                                Note: Integration settings cannot be changed after project creation.
                            </p>
                        </div>
                    </CardContent>
                    <CardFooter className="flex justify-between border-t pt-6">
                        <Button type="button" variant="outline" onClick={handleBack} disabled={isSaving}>
                            Cancel
                        </Button>
                        <Button type="submit" disabled={isSaving}>
                            {isSaving ? (
                                <>
                                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                    Saving...
                                </>
                            ) : (
                                <>
                                    <Save className="h-4 w-4 mr-2" />
                                    Save Changes
                                </>
                            )}
                        </Button>
                    </CardFooter>
                </Card>
            </form>
        </div>
    )
}
