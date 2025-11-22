"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { useOrganization } from "@/lib/hooks/use-organizations"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { SectionPlaceholder } from "@/components/shared/section-placeholder"
import { Skeleton } from "@/components/ui/skeleton"
import { ArrowLeft, Building2, Save, Loader2 } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

export default function EditOrganizationPage() {
    const params = useParams()
    const router = useRouter()
    const { toast } = useToast()
    const organizationId = params.id as string

    const { data, isLoading, error, refetch } = useOrganization(organizationId)
    
    const [formData, setFormData] = useState({
        name: "",
    })
    const [isSaving, setIsSaving] = useState(false)

    useEffect(() => {
        if (data?.organization) {
            setFormData({
                name: data.organization.name,
            })
        }
    }, [data])

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsSaving(true)

        try {
            // TODO: Implement API call to update organization
            // await organizationsApi.update(organizationId, formData)
            
            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 1000))
            
            toast({
                title: "Success",
                description: "Organization updated successfully",
            })
            
            router.push(`/admin/clients/${organizationId}`)
        } catch (error) {
            toast({
                title: "Error",
                description: "Failed to update organization. Please try again.",
                variant: "destructive",
            })
        } finally {
            setIsSaving(false)
        }
    }

    const handleCancel = () => {
        router.push(`/admin/clients/${organizationId}`)
    }

    if (isLoading) {
        return (
            <div className="space-y-6">
                <Button
                    variant="ghost"
                    onClick={() => router.push(`/admin/clients/${organizationId}`)}
                    className="mb-4"
                >
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Back to Organization
                </Button>
                <Card>
                    <CardHeader>
                        <Skeleton className="h-8 w-64" />
                        <Skeleton className="h-4 w-96 mt-2" />
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="space-y-2">
                            <Skeleton className="h-4 w-32" />
                            <Skeleton className="h-10 w-full" />
                        </div>
                        <div className="space-y-2">
                            <Skeleton className="h-4 w-32" />
                            <Skeleton className="h-10 w-full" />
                        </div>
                        <div className="flex gap-3">
                            <Skeleton className="h-10 w-24" />
                            <Skeleton className="h-10 w-24" />
                        </div>
                    </CardContent>
                </Card>
            </div>
        )
    }

    if (error) {
        return (
            <div className="space-y-6">
                <Button
                    variant="ghost"
                    onClick={() => router.push(`/admin/clients/${organizationId}`)}
                    className="mb-4"
                >
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Back to Organization
                </Button>
                <SectionPlaceholder
                    variant="error"
                    icon={Building2}
                    title="Failed to load organization"
                    description="There was an error loading the organization details. Please try again."
                    action={{
                        label: "Retry",
                        onClick: () => refetch(),
                    }}
                />
            </div>
        )
    }

    if (!data) {
        return (
            <div className="space-y-6">
                <Button
                    variant="ghost"
                    onClick={() => router.push("/admin/clients")}
                    className="mb-4"
                >
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Back to Organizations
                </Button>
                <SectionPlaceholder
                    variant="info"
                    icon={Building2}
                    title="Organization not found"
                    description="The organization you're looking for doesn't exist or has been deleted."
                    action={{
                        label: "Go to Organizations",
                        onClick: () => router.push("/admin/clients"),
                    }}
                />
            </div>
        )
    }

    const { organization } = data

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div className="space-y-1">
                    <Button
                        variant="ghost"
                        onClick={() => router.push(`/admin/clients/${organizationId}`)}
                        className="mb-2 -ml-2"
                    >
                        <ArrowLeft className="h-4 w-4 mr-2" />
                        Back to Organization
                    </Button>
                    <h1 className="text-3xl font-bold tracking-tight">Edit Organization</h1>
                    <p className="text-muted-foreground">
                        Update organization details and settings
                    </p>
                </div>
            </div>

            <form onSubmit={handleSubmit}>
                <Card>
                    <CardHeader>
                        <CardTitle>Organization Information</CardTitle>
                        <CardDescription>
                            Update the organization's basic information
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="space-y-2">
                            <Label htmlFor="name">Organization Name *</Label>
                            <Input
                                id="name"
                                type="text"
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                placeholder="Enter organization name"
                                required
                                minLength={2}
                                maxLength={100}
                            />
                            <p className="text-xs text-muted-foreground">
                                The name will be visible to all organization members
                            </p>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="slug">Slug (Auto-generated)</Label>
                            <Input
                                id="slug"
                                type="text"
                                value={organization.slug}
                                disabled
                                className="bg-muted"
                            />
                            <p className="text-xs text-muted-foreground">
                                The slug is auto-generated and cannot be changed
                            </p>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="owner">Organization Owner</Label>
                            <Input
                                id="owner"
                                type="text"
                                value={`${organization.owner.name} (${organization.owner.email})`}
                                disabled
                                className="bg-muted"
                            />
                            <p className="text-xs text-muted-foreground">
                                The owner cannot be changed from this form
                            </p>
                        </div>

                        <div className="flex items-center gap-3 pt-4 border-t">
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
                            <Button
                                type="button"
                                variant="outline"
                                onClick={handleCancel}
                                disabled={isSaving}
                            >
                                Cancel
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            </form>

            <Card>
                <CardHeader>
                    <CardTitle>Organization Metadata</CardTitle>
                    <CardDescription>Read-only information about this organization</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="grid gap-4 md:grid-cols-2">
                        <div>
                            <p className="text-sm text-muted-foreground mb-1">Organization ID</p>
                            <p className="font-mono text-xs">{organization.id}</p>
                        </div>
                        <div>
                            <p className="text-sm text-muted-foreground mb-1">Created At</p>
                            <p className="text-sm">
                                {new Date(organization.createdAt).toLocaleDateString('en-US', {
                                    year: 'numeric',
                                    month: 'long',
                                    day: 'numeric'
                                })}
                            </p>
                        </div>
                        <div>
                            <p className="text-sm text-muted-foreground mb-1">Last Updated</p>
                            <p className="text-sm">
                                {new Date(organization.updatedAt).toLocaleDateString('en-US', {
                                    year: 'numeric',
                                    month: 'long',
                                    day: 'numeric'
                                })}
                            </p>
                        </div>
                        <div>
                            <p className="text-sm text-muted-foreground mb-1">Total Projects</p>
                            <p className="text-sm">{organization._count?.projects || 0}</p>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
