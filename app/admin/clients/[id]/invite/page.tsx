"use client"

import { useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { useOrganization } from "@/lib/hooks/use-organizations"
import { InviteUserForm, type InviteFormData } from "@/components/admin/invite-user-form"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { OrganizationDetailsLoading } from "@/app/admin/clients/components/organization-details-loading"
import { SectionPlaceholder } from "@/components/shared/section-placeholder"
import { ArrowLeft, Building2, CheckCircle2 } from "lucide-react"
import apiClient from "@/lib/api-client"
import { useSession } from "next-auth/react"

export default function InviteUserPage() {
    const params = useParams()
    const router = useRouter()
    const queryClient = useQueryClient()
    const { data: session } = useSession()
    const organizationId = params.id as string

    const [successMessage, setSuccessMessage] = useState<string | null>(null)

    const { data: orgData, isLoading, error, refetch } = useOrganization(organizationId)

    const inviteMutation = useMutation({
        mutationFn: async (data: InviteFormData) => {
            const response = await apiClient.post("/invitations", {
                email: data.email,
                name: data.name,
                type: data.type,
                organizationId,
            })
            return response.data
        },
        onSuccess: (data, variables) => {
            setSuccessMessage(
                `Invitation sent successfully to ${variables.email}. They will receive an email with instructions to join the organization.`
            )
            queryClient.invalidateQueries({ queryKey: ["organization", organizationId] })
            
            setTimeout(() => {
                router.push(`/admin/clients/${organizationId}`)
            }, 3000)
        },
    })

    const isSuperAdmin = session?.user?.role === "super_admin"

    if (isLoading) {
        return <OrganizationDetailsLoading />
    }

    if (error || !orgData) {
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

    const { organization } = orgData

    return (
        <div className="space-y-6 max-w-3xl">
            <div className="space-y-1">
                <Button
                    variant="ghost"
                    onClick={() => router.push(`/admin/clients/${organizationId}`)}
                    className="mb-2 -ml-2"
                >
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Back to {organization.name}
                </Button>
                <h1 className="text-3xl font-bold tracking-tight">Invite User</h1>
                <p className="text-muted-foreground">
                    Send an invitation to join {organization.name}
                </p>
            </div>

            {successMessage && (
                <Alert className="bg-green-500/10 border-green-500/20 text-green-700 dark:text-green-400">
                    <CheckCircle2 className="h-4 w-4" />
                    <AlertDescription>{successMessage}</AlertDescription>
                </Alert>
            )}

            {!isSuperAdmin && (
                <Alert>
                    <AlertDescription>
                        <strong>Note:</strong> As an organization owner, you can only invite team members. Super admins can invite organization owners.
                    </AlertDescription>
                </Alert>
            )}

            <InviteUserForm
                organizationName={organization.name}
                defaultType="org_user"
                onSubmit={(data) => inviteMutation.mutate(data)}
                isSubmitting={inviteMutation.isPending}
                error={inviteMutation.error instanceof Error ? inviteMutation.error.message : null}
                canInviteOwner={isSuperAdmin}
            />

            {organization.invitations && organization.invitations.length > 0 && (
                <Card>
                    <CardHeader>
                        <CardTitle>Pending Invitations</CardTitle>
                        <CardDescription>
                            Users who have been invited but haven't accepted yet
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-3">
                            {organization.invitations.map((invitation) => (
                                <div
                                    key={invitation.id}
                                    className="flex items-center justify-between p-3 border rounded-lg"
                                >
                                    <div>
                                        <p className="font-medium">{invitation.email}</p>
                                        <p className="text-sm text-muted-foreground">
                                            Invited by {invitation.invitedBy.name} •{" "}
                                            {new Date(invitation.createdAt).toLocaleDateString()}
                                        </p>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <span className="text-xs text-muted-foreground capitalize">
                                            {invitation.type.replace("_", " ")}
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            )}
        </div>
    )
}
