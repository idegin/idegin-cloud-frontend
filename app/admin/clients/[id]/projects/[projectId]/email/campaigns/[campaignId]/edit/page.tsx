"use client"

import { useParams, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import CampaignBuilder from "@/components/email/CampaignBuilder"

export default function EditCampaignPage() {
    const params = useParams()
    const router = useRouter()
    const clientId = params.id as string
    const projectId = params.projectId as string
    const campaignId = params.campaignId as string

    const handleBack = () => {
        router.push(`/admin/clients/${clientId}/projects/${projectId}/email/campaigns`)
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
                    Back to Campaigns
                </Button>
                <h1 className="text-3xl font-bold tracking-tight">Edit Campaign</h1>
                <p className="text-muted-foreground">
                    Campaign ID: {campaignId}
                </p>
            </div>

            <CampaignBuilder />
        </div>
    )
}
