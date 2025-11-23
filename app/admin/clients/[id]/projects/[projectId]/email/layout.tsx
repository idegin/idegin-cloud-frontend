"use client"

import { EmailCampaignProvider } from "@/lib/contexts/EmailCampaignContext"

export default function EmailLayout({ children }: { children: React.ReactNode }) {
    return (
        <EmailCampaignProvider>
            {children}
        </EmailCampaignProvider>
    )
}
